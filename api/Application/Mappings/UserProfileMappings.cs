using CoachApi.Application.Contracts.Dtos;
using CoachApi.Domain.Entities;

namespace CoachApi.Application.Mappings;

public static class UserProfileMappings
{
    public static UserProfileDto ToDto(this UserProfile profile)
    {
        return new UserProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            AvatarUrl = profile.AvatarUrl,
            Bio = profile.Bio,
            Gender = profile.Gender,
            Region = profile.Region,
            Theme = profile.Theme,
            ReceiveEmailNotifications = profile.ReceiveEmailNotifications,
        };
    }

    public static List<UserProfileDto> ToDtoList(this IEnumerable<UserProfile> profiles)
    {
        return [.. profiles.Select(p => p.ToDto())];
    }
}