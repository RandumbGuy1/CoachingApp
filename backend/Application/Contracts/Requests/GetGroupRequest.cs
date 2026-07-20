namespace CoachApi.Application.Contracts.Requests;

public class GetGroupRequest
{   
    public string? IncludeString { get; set; }

    public bool? IsPublic { get; set; } 
    public bool? IsRequestToJoin { get; set; } 

    //Filters groups by wether sender is in the groups 
    public bool? IsUserInGroup { get; set; } 

    //Filters groups by wether other user is in the groups 
    public bool? IsOtherUserInGroup { get; set; } 
    public Guid? OtherUserId { get; set; } 

    //Pagnation properties, if null then loads ALL
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}