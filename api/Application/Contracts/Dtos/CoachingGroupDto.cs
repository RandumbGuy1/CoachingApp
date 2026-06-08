namespace CoachApi.Application.Contracts.Dtos;

public class CoachingGroupDto
{
    public Guid Id { get; set; }

    public required string Name { get; set; }
    public required int MemberCount { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool IsRequestToJoin { get; set; } = false;
}