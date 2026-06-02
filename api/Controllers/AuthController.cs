using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CoachApi.Models;
using CoachApi.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using CoachApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace CoachApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IConfiguration config, AppDbContext context) : ControllerBase
    {
        private readonly IConfiguration _config = config;
        private readonly AppDbContext _db = context;

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == request.Identifier || u.Username == request.Identifier);
            if (user == null) return Unauthorized("Username or email not found");

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Password does not match the provided username/email");

            var accessToken = GenerateJwtToken(user.Email, user.Id.ToString(), user.Username, user.Tier.ToString());
            var refreshToken = GenerateRefreshToken(user);

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            return Ok(new AuthResponse() { AccessToken = accessToken, RefreshToken = refreshToken.Token });
        }

        private string GenerateJwtToken(string email, string userId, string username, string tier)
        {
            #pragma warning disable CS8604 // Possible null reference argument.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            #pragma warning restore CS8604 // Possible null reference argument.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: 
                [ 
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim("username", username),
                    new Claim(ClaimTypes.Role, tier)
                ],
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Email == request.Email)) return BadRequest("Email already in use");
            if (await _db.Users.AnyAsync(u => u.Username == request.Username)) return BadRequest("Username already taken");

            var hasher = new PasswordHasher<User>();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = request.Email,
                Username = request.Username,
                Tier = request.Tier,
                Profile = new UserProfile
                {
                    UserId = userId,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Bio = "",
                    AvatarUrl = "",
                    Gender = request.Gender,
                    Region = request.Region
                },
                PasswordHash = "" // Will be set after hashing
            };

            user.PasswordHash = hasher.HashPassword(user, request.Password);

            _db.Users.Add(user);

            var accessToken = GenerateJwtToken(user.Email, user.Id.ToString(), user.Username, user.Tier.ToString()); 
            var refreshToken = GenerateRefreshToken(user);

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();
            
            return Ok(new AuthResponse() { AccessToken = accessToken, RefreshToken = refreshToken.Token });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshRequest request)
        {
            var existingToken = await _db.RefreshTokens
                .Include(rt => rt.User)
                .SingleOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (existingToken == null) return Unauthorized("Invalid refresh token");

            if (existingToken.IsRevoked)
            {
                await RevokeAllUserTokensAsync(existingToken);
                return Unauthorized("Token reuse detected. All sessions revoked");
            }

            if (existingToken.ReplacedByToken != null)
            {
                await RevokeAllUserTokensAsync(existingToken);
                return Unauthorized("Token has been replaced. All sessions revoked");
            }

            if (existingToken.IsExpired) return Unauthorized("Refresh token has expired");

            var user = existingToken.User;
            if (user == null) return Unauthorized();

            var newAccessToken = GenerateJwtToken(user.Email, user.Id.ToString(), user.Username, user.Tier.ToString());
            var newRefreshToken = await RotateRefreshTokenAsync(existingToken);

            await RemoveOldTokensAsync(user.Id);

            return Ok(new AuthResponse() { AccessToken = newAccessToken, RefreshToken = newRefreshToken.Token });
        }

        private async Task RemoveOldTokensAsync(Guid userId)
        {
            var oldTokens = _db.RefreshTokens
                .Where(t => t.UserId == userId && (t.IsExpired || t.IsRevoked));

            _db.RefreshTokens.RemoveRange(oldTokens);
            await _db.SaveChangesAsync();
        }

        private async Task RevokeAllUserTokensAsync(RefreshToken token)
        {
            var userTokens = _db.RefreshTokens.Where(t => t.UserId == token.UserId);

            foreach (var t in userTokens)
                t.RevokedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }

        private static RefreshToken GenerateRefreshToken(User user)
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(randomBytes);

            return new RefreshToken
            {
                UserId = user.Id,
                Token = token,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
            };
        }

        private async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken oldToken)
        {
            var newToken = GenerateRefreshToken(oldToken.User);

            oldToken.RevokedAt = DateTime.UtcNow;
            oldToken.ReplacedByToken = newToken.Token;

            _db.RefreshTokens.Add(newToken);
            await _db.SaveChangesAsync();

            return newToken;
        }
    }
}
