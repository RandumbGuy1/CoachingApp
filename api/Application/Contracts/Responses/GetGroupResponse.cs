using CoachApi.Application.Contracts.Dtos;

namespace CoachApi.Application.Contracts.Responses;

public class GetGroupResponse
{
    public List<CoachingGroupDto> Groups { get; set; } = [];

    public int? Page { get; set; }
    public int? PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}
