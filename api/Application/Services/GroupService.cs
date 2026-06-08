using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Contracts.Responses;
using CoachApi.Application.Mappings;
using CoachApi.Domain.Entities;
using CoachApi.Domain.Enums;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CoachApi.Application.Services;

public class GroupService(AppDbContext context)
{
    private readonly AppDbContext _db = context;

    public async Task<CreateGroupResponse> CreateGroupAsync(CreateGroupRequest request, Guid userId)
    {
        var group = new CoachingGroup 
        { 
            Id = Guid.NewGuid(), 
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            Color = request.Color,
            IsPublic = request.IsPublic,
            IsRequestToJoin = request.IsRequestToJoin
        };
        
        _db.CoachingGroups.Add(group);
        await _db.SaveChangesAsync();

        //Doing this is enough to link the user to the group
        _db.Memberships.Add(new GroupMembership
        {
            UserId = userId,
            CoachingGroupId = group.Id,
            Role = GroupRole.Owner
        });

        await _db.SaveChangesAsync();
        return new CreateGroupResponse { Name = group.Name };
    }

    public async Task<JoinResponse> JoinGroupAsync(Guid groupId, JoinCodeRequest request, Guid userId)
    {
        var group = await _db.CoachingGroups.FindAsync(groupId) 
            ?? throw new InvalidOperationException("Group not found");

        var existsInGroup = await _db.Memberships
            .AnyAsync(x => x.UserId == userId && x.CoachingGroupId == groupId);

        if (existsInGroup) throw new InvalidOperationException("Already in this group");

        //Non public groups require a code to join
        if (!group.IsPublic && group.Code != request.Code)
            throw new InvalidOperationException("Invalid join code");

        //Send a join request if the group requires approval to join, otherwise add them to the group directly
        if (group.IsRequestToJoin)
        {
            _db.PendingMemberships.Add(new JoinRequest
            {
                UserId = userId,
                CoachingGroupId = groupId,
                Status = JoinRequestStatus.Pending
            });

            await _db.SaveChangesAsync();

            return new JoinResponse { IsPending = true };
        }

        _db.Memberships.Add(new GroupMembership
        {
            UserId = userId,
            CoachingGroupId = groupId,
            Role = GroupRole.Client
        });

        await _db.SaveChangesAsync();

        return new JoinResponse { IsPending = false };
    }

    public async Task AddClientAsync(Guid groupId, Guid userId, Guid coachId)
    {
        var isCoachInGroup = await _db.Memberships
            .Select(x => x.UserId == coachId && x.CoachingGroupId == groupId && (x.Role == GroupRole.Coach || x.Role == GroupRole.Owner))
            .AnyAsync();

        if (!isCoachInGroup) throw new InvalidOperationException("You must be a coach in this group to add clients");

        _db.Memberships.Add(new GroupMembership
        {
            UserId = userId,
            CoachingGroupId = groupId,
            Role = GroupRole.Client
        });

        await _db.SaveChangesAsync();
    }

    public async Task PromoteUserAsync(Guid groupId, Guid userId, Guid coachId)
    {
        var isCoachInGroup = await _db.Memberships
            .AnyAsync(x => x.UserId == coachId && x.CoachingGroupId == groupId && (x.Role == GroupRole.Coach || x.Role == GroupRole.Owner));

        if (!isCoachInGroup) throw new InvalidOperationException("You must be a coach in this group to promote clients");

        var membership = await _db.Memberships.FirstOrDefaultAsync(x => x.UserId == userId && x.CoachingGroupId == groupId) 
            ?? throw new InvalidOperationException("User not found in this group");

        if (membership.Role == GroupRole.Coach || membership.Role == GroupRole.Owner)
            throw new InvalidOperationException("User is already a coach/owner");

        if (membership.UserId == coachId)
            throw new InvalidOperationException("Cannot change your own role");

        membership.Role = GroupRole.Coach;

        await _db.SaveChangesAsync();
    }

    public async Task TransferOwnershipAsync(Guid groupId, Guid userId, Guid ownerId)
    {
        var ownerMembership = await _db.Memberships
            .FirstOrDefaultAsync(x => x.UserId == ownerId && x.CoachingGroupId == groupId && x.Role == GroupRole.Owner) 
            ?? throw new InvalidOperationException("You must be the owner of this group to transfer ownership");

        var membership = await _db.Memberships.FirstOrDefaultAsync(x => x.UserId == userId && x.CoachingGroupId == groupId) 
            ?? throw new InvalidOperationException("User not found in this group");

        if (membership.Role == GroupRole.Client)
            throw new InvalidOperationException("User must be a coach to be promoted to owner");

        if (membership.UserId == ownerId)
            throw new InvalidOperationException("Cannot transfer ownership to yourself");

        membership.Role = GroupRole.Owner;
        ownerMembership.Role = GroupRole.Coach;

        await _db.SaveChangesAsync();
    }

    public async Task<GetGroupResponse> GetGroupsAsync(GetGroupRequest request, Guid userId)
    {
        var query = _db.CoachingGroups.AsQueryable();

        if (request.IncludeGroupsIn)
            query = query.Where(g => g.IsPublic || _db.Memberships.Any(m => m.CoachingGroupId == g.Id && m.UserId == userId));
        else 
            query = query.Where(g => g.IsPublic);

        if (!request.IncludeRequestToJoin)
            query = query.Where(g => !g.IsRequestToJoin);

        if (!string.IsNullOrWhiteSpace(request.IncludeString))
            query = query.Where(g => g.Name.Contains(request.IncludeString));

        var groups = await query.ToListAsync();

        return new GetGroupResponse{ Groups = groups.ToDtoList() };
    }
}