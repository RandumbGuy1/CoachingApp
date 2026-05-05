using System.Security.Claims;

namespace CoachApi.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var idClaim = (user.FindFirst(ClaimTypes.NameIdentifier) 
                ?? user.FindFirst("sub") 
                ?? user.FindFirst("id")) ?? throw new Exception("User ID claim not found in token");
            return Guid.Parse(idClaim.Value);
        }
    }
}
