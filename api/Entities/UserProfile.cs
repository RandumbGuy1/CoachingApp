namespace CoachApi.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;

        public string ProfilePictureURL { get; set; } = default!;
        public string Bio { get; set; } = default!;
        public Gender? Gender { get; set; } = default!;
        public string? Timezone { get; set; } = default!;
        public Region? Region { get; set; } = default!;
    }

    public enum Gender
    {
        Male,
        Female,
        NonBinary,
        PreferNotToSay,
        Other
    }

    public enum Region
    {
        NorthAmerica,
        Europe,
        Asia,
        SouthAmerica,
        Africa,
        Oceania,
        MiddleEast,
        Other
    }
}