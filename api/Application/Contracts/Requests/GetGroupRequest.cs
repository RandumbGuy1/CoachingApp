namespace CoachApi.Application.Contracts.Requests;

public class GetGroupRequest
{   
    public required string IncludeString { get; set; } = "";
    public required bool IncludeRequestToJoin { get; set; } = false;
    public required bool IncludeGroupsIn { get; set; } = false;

    //Pagnation properties, if null then loads ALL
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}