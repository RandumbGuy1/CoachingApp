namespace CoachApi.Entities
{
    public class CoachingGroup
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public List<Coach> Coaches { get; set; } = [];
        public List<Client> Clients { get; set; } = [];
        public required string Code { get; set; }
        public string Description { get; set; } = "";
        public string Color { get; set; } = "#FFFFFF";
        public bool IsPublic { get; set; } = true;
        public bool IsRequestToJoin { get; set; } = false;
    }

    public enum GroupRole
    {
        Owner,
        Admin,
        Member,
    }
}
