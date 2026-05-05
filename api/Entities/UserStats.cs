namespace CoachApi.Entities
{
    public class UserStats
    {
        public required Guid Id { get; set; }

        public required Guid UserId { get; set; }
        public required User User { get; set; } = default!;

        public required string FormType { get; set; } = default!; //"intake", "weekly-checkin"

        public required string JsonData { get; set; } = default!; 

        public required DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}