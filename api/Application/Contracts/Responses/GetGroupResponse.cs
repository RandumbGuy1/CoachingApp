using CoachApi.Application.Contracts.Dtos;

namespace CoachApi.Application.Contracts.Responses;

public class GetGroupResponse
{
    public List<CoachingGroupDto> Groups { get; set; } = [];
}
