using CoachApi.Application.Contracts.Dtos;
using CoachApi.Domain.Entities;

namespace CoachApi.Application.Mappings;

public static class GroupMappings
{
    public static CoachingGroupDto ToDto(this CoachingGroup group)
    {
        return new CoachingGroupDto
        {
            Id = group.Id,
            Name = group.Name,
            Color = group.Color,
            Description = group.Description,
            IsPublic = group.IsPublic,
            IsRequestToJoin = group.IsRequestToJoin,
            MemberCount = group.Members.Count
        };
    }

    public static GroupMembershipDto ToDto(this GroupMembership membership)
    {
        return new GroupMembershipDto
        {
            Id = membership.Id,
            Role = membership.Role,
            CoachingGroupId = membership.CoachingGroupId,
            UserId = membership.CoachingGroupId
        };
    }

    public static List<CoachingGroupDto> ToDtoList(this IEnumerable<CoachingGroup> groups)
    {
        return [.. groups.Select(g => g.ToDto())];
    }

    public static List<GroupMembershipDto> ToDtoList(this IEnumerable<GroupMembership> groups)
    {
        return [.. groups.Select(g => g.ToDto())];
    }
}
