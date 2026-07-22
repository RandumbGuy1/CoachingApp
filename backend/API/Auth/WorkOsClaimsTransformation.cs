using System.Security.Claims;
using CoachApi.Domain.Entities;
using CoachApi.Domain.Enums;
using CoachApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using WorkOS;

using User = CoachApi.Domain.Entities.User;

namespace CoachApi.API.Auth;

public class WorkOsClaimsTransformation(AppDbContext _db, WorkOSClient _workOsClient) : IClaimsTransformation
{
    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is not { IsAuthenticated: true } || principal.HasClaim(claim => claim.Type == ClaimTypes.Role))
            return principal;

        var workOsUserId = principal.FindFirst("sub")?.Value 
            ?? throw new InvalidOperationException("WorkOS access token missing 'sub' claim");

        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(user => user.WorkOSUserId == workOsUserId)
            ?? await ProvisionUserAsync(workOsUserId);

        var identity = (ClaimsIdentity) principal.Identity;
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
        identity.AddClaim(new Claim(ClaimTypes.Role, user.Tier.ToString()));
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));

        return principal;
    }

    private async Task<User> ProvisionUserAsync(string workOsUserId)
    {
        var workOsUser = await _workOsClient.UserManagement.GetAsync(workOsUserId);
        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            WorkOSUserId = workOsUserId,
            Username = $"user_{userId:N}",
            Email = workOsUser.Email,
            Tier = UserTier.Free,
            Profile = new UserProfile
            {
                UserId = userId,
                FirstName = workOsUser.FirstName ?? "",
                LastName = workOsUser.LastName ?? "",
            }
        };

        _db.Users.Add(user);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(user => user.WorkOSUserId == workOsUserId) 
                ?? throw new InvalidOperationException("Failed to provision user.");
        }

        return user;
    }
}