using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Requests;

public class SaveUserRequest
{
    public string? Username { get; set; }
    public UserTier? Tier { get; set; }
}

