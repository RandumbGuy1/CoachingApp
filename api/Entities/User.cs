namespace CoachApi.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; } = default!;

        //Permissions
        public required UserTier Tier { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; } = [];

        //Navigation properties
        public required UserProfile Profile { get; set; } = default!;
        public List<GroupMembership> Memberships { get; set; } = [];
    }

    public enum UserTier
    {
        Enterprise, //Can create and own unlimited groups, can oversee and modify all relevant data in the group
        Pro, //Can create and own 1 group
        Free //Can join groups and create unlimited routines
    }
} 