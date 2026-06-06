using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Dtos;

public class UserDto
{
    public required Guid Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required UserTier Tier { get; set; }
}


