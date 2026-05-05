namespace CoachApi.Entities
{
    public class Client
    {
        public Guid UserId { get; set; } 
        public User User { get; set; } = default!;
        public Guid CoachingGroupId { get; set; } 
        public CoachingGroup Group { get; set; } = default!;
        public GroupRole Role { get; set; } = GroupRole.Member;
    }
}