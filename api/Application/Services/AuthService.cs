using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Contracts.Responses;
using CoachApi.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace CoachApi.Application.Services;

public class AuthService(IConfiguration _config, AppDbContext _db)
{    
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == request.Identifier || u.Username == request.Identifier) 
            ?? throw new UnauthorizedAccessException("Username or email not found");

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Password does not match the provided username/email");

        var accessToken = GenerateJwtToken(user.Id.ToString(), user.Email, user.Username, user.Tier.ToString());
        var refreshToken = GenerateRefreshToken(user);

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();

        return new AuthResponse() { AccessToken = accessToken, RefreshToken = refreshToken.Token };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email)) 
            throw new InvalidOperationException("Email already in use");

        if (await _db.Users.AnyAsync(u => u.Username == request.Username)) 
            throw new InvalidOperationException("Username already taken");

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
        await _db.SaveChangesAsync();

        var accessToken = GenerateJwtToken(user.Id.ToString(), user.Email, user.Username, user.Tier.ToString()); 
        var refreshToken = GenerateRefreshToken(user);

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();
        
        return new AuthResponse() { AccessToken = accessToken, RefreshToken = refreshToken.Token };
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshRequest request)
    {
        var existingToken = await _db.RefreshTokens
            .Include(rt => rt.User)
            .SingleOrDefaultAsync(rt => rt.Token == request.RefreshToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token");

        if (existingToken.RevokedAt != null)
        {
            await RevokeAllUserTokensAsync(existingToken.UserId);
            throw new UnauthorizedAccessException("Token reuse detected. All sessions revoked");
        }

        if (existingToken.ReplacedByToken != null)
        {
            await RevokeAllUserTokensAsync(existingToken.UserId);
            throw new UnauthorizedAccessException("Token already replaced. All sessions revoked");
        }

        if (existingToken.ExpiresAt <= DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token has expired");

        var user = existingToken.User ?? throw new UnauthorizedAccessException("User not found");

        var newAccessToken = GenerateJwtToken(user.Id.ToString(), user.Email, user.Username, user.Tier.ToString());
        var newRefreshToken = await RotateRefreshTokenAsync(existingToken);

        await RemoveOldTokensAsync(user.Id);

        return new AuthResponse() { AccessToken = newAccessToken, RefreshToken = newRefreshToken.Token };
    }

    public async Task<AuthResponse> SaveUserAsync(SaveUserRequest request, Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId) 
            ?? throw new InvalidOperationException("User not found");

        bool requiresPassword = 
            !string.IsNullOrEmpty(request.NewPassword) || 
            !string.IsNullOrEmpty(request.Email) || 
            !string.IsNullOrEmpty(request.Username); 

        if (requiresPassword)
        {
            if (string.IsNullOrEmpty(request.CurrentPassword))
                throw new InvalidOperationException("Current password is required.");

            var hasher = new PasswordHasher<User>();
            var verify = hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);

            if (verify == PasswordVerificationResult.Failed)
                throw new InvalidOperationException("Current password is incorrect.");
        }

        if (!string.IsNullOrEmpty(request.Username))
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
                throw new InvalidOperationException("Username already taken");

            user.Username = request.Username;
        }
        
        if (!string.IsNullOrEmpty(request.Email))
        {
            if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email already in use");

            user.Email = request.Email;
        }

        if (!string.IsNullOrEmpty(request.NewPassword))
        {
            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, request.NewPassword);
        }

        if (request.Tier.HasValue)
            user.Tier = request.Tier.Value;

        await _db.SaveChangesAsync();

        //Remove all existing tokens to force re-login with new credentials, and remove old tokens to clean up the database
        await RevokeAllUserTokensAsync(userId);
        await RemoveOldTokensAsync(userId);

        var accessToken = GenerateJwtToken(userId.ToString(), user.Email, user.Username, user.Tier.ToString()); 
        var refreshToken = GenerateRefreshToken(user);

        _db.RefreshTokens.Add(refreshToken);

        await _db.SaveChangesAsync();

        return new AuthResponse() { AccessToken = accessToken, RefreshToken = refreshToken.Token };
    }

    // Moved the token generation and refresh logic to this service to keep the controller cleaner and more focused on handling HTTP requests
    public string GenerateJwtToken(string userId, string email, string username, string tier)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT issuer not configured"),
            audience: _config["Jwt:Audience"] ?? throw new InvalidOperationException("JWT audience not configured"),
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

    public RefreshToken GenerateRefreshToken(User user)
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

    public async Task RemoveOldTokensAsync(Guid userId)
    {
        //Note: Do NOT filter on the db with computed properties
        var oldTokens = await _db.RefreshTokens
            .Where(r =>
                r.UserId == userId &&
                (r.ExpiresAt <= DateTime.UtcNow || r.RevokedAt != null)
            )
            .ToListAsync();

        _db.RefreshTokens.RemoveRange(oldTokens);
        await _db.SaveChangesAsync();
    }

    public async Task RevokeAllUserTokensAsync(Guid userId)
    {
        var userTokens = _db.RefreshTokens.Where(t => t.UserId == userId);

        foreach (var t in userTokens)
            t.RevokedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    public async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken oldToken)
    {
        var newToken = GenerateRefreshToken(oldToken.User);

        oldToken.RevokedAt = DateTime.UtcNow;
        oldToken.ReplacedByToken = newToken.Token;

        _db.RefreshTokens.Add(newToken);
        await _db.SaveChangesAsync();

        return newToken;
    }
}