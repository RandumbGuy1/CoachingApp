namespace CoachApi.Domain.Entities;

public class ProcessedStripeEvent
{
    public required string StripeEventId { get; set; }
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}