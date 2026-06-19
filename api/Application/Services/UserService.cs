using CoachApi.Application.Contracts.Dtos;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Mappings;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CoachApi.Application.Services;

public class UserService(AppDbContext _db, IWebHostEnvironment _env)
{
    public async Task<UserDto> GetUserAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId) 
            ?? throw new InvalidOperationException("User was not found");

        return user.ToDto();
    }

    public async Task<UserProfileDto> GetUserProfileAsync(Guid userId)
    {
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new InvalidOperationException("User profile was not found");

        return profile.ToDto();
    }

    public async Task<UserProfileDto> SaveUserProfileAsync(SaveProfileRequest request, Guid userId)
    {
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new InvalidOperationException("User profile was not found");

        if (!string.IsNullOrEmpty(request.FirstName))
            profile.FirstName = request.FirstName;

        if (!string.IsNullOrEmpty(request.LastName))
            profile.LastName = request.LastName;

        if (!string.IsNullOrEmpty(request.Bio))
            profile.Bio = request.Bio;

        if (request.Gender.HasValue)
            profile.Gender = request.Gender.Value;

        if (request.Region.HasValue)
            profile.Region = request.Region.Value;

        if (request.Theme.HasValue)
            profile.Theme = request.Theme.Value;

        if (request.ReceiveEmailNotifications.HasValue)
            profile.ReceiveEmailNotifications = request.ReceiveEmailNotifications.Value;

        await _db.SaveChangesAsync();

        return profile.ToDto();
    }

    public async Task UploadAvatarAsync(IFormFile avatar, Guid userId)
    {
        if (avatar == null || avatar.Length == 0) throw new InvalidOperationException("No file uploaded");

        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new InvalidOperationException("User profile was not found");

        var uploadsPath = Path.Combine(_env.WebRootPath, "avatars", userId.ToString());
        Directory.CreateDirectory(uploadsPath);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(avatar.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
            await avatar.CopyToAsync(stream);

        var publicUrl = $"/avatars/{userId}/{fileName}";

        profile.AvatarUrl = publicUrl;
        await _db.SaveChangesAsync();
    }
}