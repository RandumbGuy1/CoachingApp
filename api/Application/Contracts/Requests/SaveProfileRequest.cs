using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Requests;

public class SaveProfileRequest
{
    public string? AvatarUrl { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public Gender? Gender { get; set; }
    public Region? Region { get; set; }
    public AppTheme? Theme { get; set; }
    public bool? ReceiveEmailNotifications { get; set; }
}

