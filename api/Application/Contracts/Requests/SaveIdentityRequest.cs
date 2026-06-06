using CoachApi.Domain.Entities;

namespace CoachApi.Application.Contracts.Requests
{ 
    public class SaveIdentityRequest
    {
        public required string CurrentPassword { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? NewPassword { get; set; }
        public UserTier? Tier { get; set; }
    }
}
