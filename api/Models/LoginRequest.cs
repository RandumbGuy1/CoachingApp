namespace CoachApi.Models 
{ 
    public class LoginRequest
    {
        public required string Identifier { get; set; } // Can be username or email
        public required string Password { get; set; }
    }
}
