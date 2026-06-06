namespace CoachApi.Domain.Entities
{
    public class WorkoutSet
    {
        public Guid Id { get; set; }
        public Guid WorkoutLogId { get; set; }
        public WorkoutLog WorkoutLog { get; set; } = default!;
        public string Exercise { get; set; } = default!;
        public int Reps { get; set; } = default;
        public float Weight { get; set; } = default;
        public int RPE { get; set; } = default;
        public int RIR { get; set; } = default;
    }
}