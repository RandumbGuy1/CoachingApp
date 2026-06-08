using CoachApi.Domain.Enums;

namespace CoachApi.Domain.Entities;

public class JoinRequest
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public Guid CoachingGroupId { get; set; }
    public CoachingGroup Group { get; set; } = default!;
    
    public string? Message { get; set; }
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public JoinRequestStatus Status { get; set; } = JoinRequestStatus.Pending;
}