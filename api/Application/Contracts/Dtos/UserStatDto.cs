namespace CoachApi.Application.Contracts.Dtos;

public class UserStatDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public required string Key { get; set; } // "bodyweight", "sleep_hours", 
    public required string Value { get; set; }
    public DateTime Timestamp { get; set; }
}