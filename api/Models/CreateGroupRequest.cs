namespace CoachApi.Models 
{ 
    public class CreateGroupRequest
    {
        public required string Name { get; set; }
        public required string Code { get; set; }
        public string Description { get; set; } = "";
        public string Color { get; set; } = "#FFFFFF";
        public bool IsPublic { get; set; } = true;
        public bool IsRequestToJoin { get; set; } = false;
    }
}