using CoachApi.Domain.Enums;

namespace CoachApi.Domain.Entities;

public class UserProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    //Basic Profile
    public required string FirstName { get; set; } = "";
    public required string LastName { get; set; } = "";
    public string? AvatarUrl { get; set; } = "";
    public string? Bio { get; set; } = "";

    //Personal info
    public Gender? Gender { get; set; } = default!;
    public Region? Region { get; set; } = default!;

    //Preferences
    public AppTheme Theme { get; set; } = AppTheme.Dark;
    public bool ReceiveEmailNotifications { get; set; } = true;
}