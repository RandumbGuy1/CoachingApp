using CoachApi.Domain.Enums;

namespace CoachApi.Domain.Entities;

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
    public Guid? SelectedMembershipId { get; set; }
}