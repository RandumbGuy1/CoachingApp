namespace CoachApi.Domain.Entities;

public class UserStat
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    public required string Key { get; set; } = default!; // "bodyweight", "sleep_hours", 
    public required string Value { get; set; } = default!; 
    public DateTime Timestamp { get; set; }
}