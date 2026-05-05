namespace CoachApi.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public User User { get; set; } = default!;
        public Guid UserId { get; set; }
        public string Token { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string? ReplacedByToken { get; set; }
        public bool IsRevoked => RevokedAt.HasValue;
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    }
}
