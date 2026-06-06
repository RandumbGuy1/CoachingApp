namespace CoachApi.Application.Contracts.Dtos;

public class WorkoutLogDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime PerformedAt { get; set; }
    public List<WorkoutSetDto> Sets { get; set; } = [];
}