using Microsoft.AspNetCore.Mvc;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using CoachApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using CoachApi.Application.Contracts.Requests;

namespace CoachApi.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController(AppDbContext context) : ControllerBase
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

        [Authorize(Roles = "Free,Pro,Enterprise")]
        [HttpPost("me/profile/save")]
        public async Task<IActionResult> SaveUserProfile([FromBody] SaveProfileRequest request)
        {
            var userId = User.GetUserId();
            var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound();

            // Update the profile properties
            if (!string.IsNullOrEmpty(request.AvatarUrl))
                profile.AvatarUrl = request.AvatarUrl;

            if (!string.IsNullOrEmpty(request.FirstName))
                profile.FirstName = request.FirstName;

            if (!string.IsNullOrEmpty(request.LastName))
                profile.LastName = request.LastName;

            if (!string.IsNullOrEmpty(request.Bio))
                profile.Bio = request.Bio;

            if (request.Gender != null)
                profile.Gender = request.Gender.Value;

            if (request.Region != null)
                profile.Region = request.Region.Value;

            if (request.Theme != null)
                profile.Theme = request.Theme.Value;

            if (request.ReceiveEmailNotifications != null)
                profile.ReceiveEmailNotifications = request.ReceiveEmailNotifications.Value;

            await _db.SaveChangesAsync();

            return Ok(profile);
        }

        [Authorize(Roles = "Free,Pro,Enterprise")]
        [HttpPost("me/profile/avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile avatar)
        {
            var userId = User.GetUserId();
            var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound();

            // Save the avatar file and update the profile
            // ... (implementation for saving avatar file)

            await _db.SaveChangesAsync();
            return Ok(profile);
        }
    }
}