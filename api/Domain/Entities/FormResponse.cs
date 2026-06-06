namespace CoachApi.Domain.Entities;

public class FormResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    public required string Type { get; set; } = default!; // "intake", "weekly_check_in", etc.
    public required string JsonData { get; set; } = default!; 
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}