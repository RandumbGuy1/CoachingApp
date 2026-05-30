namespace CoachApi.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = default!;

        //Basic Profile
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string ProfilePictureURL { get; set; } = "";
        public string Bio { get; set; } = "";

        //Personal info
        public Gender? Gender { get; set; } = default!;
        public string? Timezone { get; set; } = default!;
        public Region? Region { get; set; } = default!;

        //Preferences
        public AppTheme Theme { get; set; } = AppTheme.Dark;
        public bool ReceiveEmailNotifications { get; set; } = true;
    }

    public enum Gender
    {
        Male,
        Female,
        NonBinary,
        Other,
    }

    public enum AppTheme
    {
        Light,
        Dark,
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