using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Requests;

public class RegisterRequest
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required UserTier Tier { get; set; }
    public required Gender Gender { get; set; }
    public required Region Region { get; set; }
}

