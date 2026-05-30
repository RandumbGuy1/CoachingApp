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
using CoachApi.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace CoachApi.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController(IConfiguration config, AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _db = context;

        [Authorize(Roles = "Free,Pro,Enterprise")]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.GetUserId();

            var user = await _db.Users
                .Include(u => u.Profile)
                .Include(u => u.Memberships)
                    .ThenInclude(m => m.Group)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [Authorize(Roles = "Free,Pro,Enterprise")]
        [HttpGet("me/profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.GetUserId();

            var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound();

            return Ok(profile);
        }
    }
}