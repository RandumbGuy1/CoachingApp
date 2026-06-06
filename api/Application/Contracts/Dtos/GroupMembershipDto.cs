using CoachApi.Domain.Enums;

namespace CoachApi.Application.Contracts.Dtos;

public class GroupMembershipDto
{
    public Guid UserId { get; set; }
    public Guid CoachingGroupId { get; set; }
    public required GroupRole Role { get; set; }
}