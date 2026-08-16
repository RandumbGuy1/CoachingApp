using CoachApi.Domain.Enums;

namespace CoachApi.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string WorkOSUserId { get; set; }
    public string? StripeCustomerId { get; set; }

    //Permissions
    public required UserTier Tier { get; set; }
    public List<UserEntitlement> Entitlements { get; set; } = [];

    //Navigation properties
    public required UserProfile Profile { get; set; } = default!;
    public List<GroupMembership> Memberships { get; set; } = [];
    public Guid? SelectedMembershipId { get; set; }
}