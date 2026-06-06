namespace CoachApi.Domain.Entities;

public class WorkoutLog
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public DateTime PerformedAt { get; set; }
    public List<WorkoutSet> Sets { get; set; } = [];
}
