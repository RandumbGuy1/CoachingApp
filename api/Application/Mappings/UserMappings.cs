using CoachApi.Application.Contracts.Dtos;
using CoachApi.Domain.Entities;

namespace CoachApi.Application.Mappings;

public static class UserMappings
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Tier = user.Tier,
        };
    }

    public static List<UserDto> ToDtoList(this IEnumerable<User> users)
    {
        return [.. users.Select(u => u.ToDto())];
    }
}