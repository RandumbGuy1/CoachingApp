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
            Description = group.Description,
            IsPublic = group.IsPublic,
            IsRequestToJoin = group.IsRequestToJoin,
            MemberCount = group.Members.Count
        };
    }

    public static List<CoachingGroupDto> ToDtoList(this IEnumerable<CoachingGroup> groups)
    {
        return [.. groups.Select(g => g.ToDto())];
    }
}
