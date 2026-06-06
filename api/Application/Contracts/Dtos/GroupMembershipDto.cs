using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Dtos;

public class GroupMembership
{
    public Guid UserId { get; set; }
    public Guid CoachingGroupId { get; set; }
    public required GroupRole Role { get; set; }
}
