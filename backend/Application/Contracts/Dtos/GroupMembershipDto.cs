using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Dtos;

public class GroupMembershipDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CoachingGroupId { get; set; }
    public CoachingGroupDto CoachingGroup { get; set; } = default!;
    public required GroupRole Role { get; set; }
}