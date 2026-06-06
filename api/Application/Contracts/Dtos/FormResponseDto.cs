namespace CoachApi.Application.Contracts.Dtos;

public class FormResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public required string Type { get; set; } 
    public required string JsonData { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}