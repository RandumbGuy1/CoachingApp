namespace CoachApi.Domain.Entities
{
    public class GroupMembership
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;
        public Guid CoachingGroupId { get; set; }
        public CoachingGroup Group { get; set; } = default!;
        public required GroupRole Role { get; set; } = GroupRole.Client;
    }

    public enum GroupRole
    {
        Owner,
        Coach,
        Client,
    }
}