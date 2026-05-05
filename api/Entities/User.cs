namespace CoachApi.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public string PasswordHash { get; set; } = default!;
        public required UserRole Role { get; set; }
        public UserProfile UserProfile { get; set; } = default!;
        public List<UserStats> UserStats { get; set; } = [];
        public List<RefreshToken> RefreshTokens { get; set; } = [];
    }

    public enum UserRole
    {
        Admin,
        Coach,
        Client,
    }
} 