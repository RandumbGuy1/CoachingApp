using CoachApi.Application.Contracts.Dtos;
using CoachApi.Application.Mappings;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CoachApi.Application.Services;

public class MembershipService(AppDbContext _db)
{
    public async Task<GroupMembershipDto?> GetSelectedMembershipAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId) 
            ?? throw new InvalidOperationException("User was not found");

        if (user.SelectedMembershipId == null) return null;

        var membership = await _db.Memberships
            .AsNoTracking()
            .Include(m => m.Group)
            .FirstOrDefaultAsync(m => m.Id == user.SelectedMembershipId && m.UserId == userId);

        if (membership == null) return null;

        return membership.ToDto();
    }

    public async Task<GroupMembershipDto> SaveSelectedMembershipAsync(Guid membershipId, Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new InvalidOperationException("User was not found");

        // Validate membership belongs to the user
        var membership = await _db.Memberships
            .FirstOrDefaultAsync(m => m.Id == membershipId && m.UserId == userId) 
            ?? throw new InvalidOperationException("Invalid membership selection");

        user.SelectedMembershipId = membership.Id;
        await _db.SaveChangesAsync();

        return membership.ToDto();
    }

    public async Task<GroupMembershipDto[]> GetAllMembershipsAsync(Guid userId)
    {
        var memberships = await _db.Memberships
            .AsNoTracking()
            .Include(m => m.Group)
            .Where(m => m.UserId == userId)
            .ToListAsync();

        return [..memberships.ToDtoList()];
    }
}