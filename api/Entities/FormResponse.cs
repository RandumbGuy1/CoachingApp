namespace CoachApi.Entities
{
    public class FormResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;

        public string Type { get; set; } = default!; // "intake", "weekly_check_in", etc.
        public string JsonData { get; set; } = default!; 
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}