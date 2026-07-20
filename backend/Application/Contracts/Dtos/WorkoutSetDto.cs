namespace CoachApi.Application.Contracts.Dtos;

public class WorkoutSetDto
{
    public Guid Id { get; set; }
    public Guid WorkoutLogId { get; set; }

    public required string Exercise { get; set; }
    public int Reps { get; set; } = default;
    public float Weight { get; set; } = default;
    public int RPE { get; set; } = default;
    public int RIR { get; set; } = default;
}