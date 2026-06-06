namespace CoachApi.Application.Contracts.Dtos;

public class CoachingGroup
{
    public Guid Id { get; set; }

    public required string Name { get; set; }
    public List<GroupMembershipDto> Members { get; set; } = [];
    public required string Code { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool IsRequestToJoin { get; set; } = false;
}