using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Dtos;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }

    public Gender? Gender { get; set; }
    public Region? Region { get; set; }
    public AppTheme Theme { get; set; }
    public bool ReceiveEmailNotifications { get; set; }
}
