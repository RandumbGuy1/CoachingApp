using CoachApi.Application.Contracts.Dtos;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Mappings;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CoachApi.Application.Services;

public class UserService(IConfiguration config, AppDbContext context)
{
    private readonly IConfiguration _config = config;
    private readonly AppDbContext _db = context;

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

        if (!string.IsNullOrEmpty(request.AvatarUrl))
            profile.AvatarUrl = request.AvatarUrl;

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

    public async Task<UserProfileDto> UploadAvatarAsync(IFormFile avatar, Guid userId)
    {
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new InvalidOperationException("User profile was not found");

        // Save the avatar file and update the profile
        // ... (implementation for saving avatar file)
        //await _db.SaveChangesAsync();

        return profile.ToDto();
    }
}