using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Contracts.Responses;
using CoachApi.Application.Mappings;
using CoachApi.Domain.Entities;
using CoachApi.Domain.Enums;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CoachApi.Application.Services;

public class GroupService(AppDbContext _db)
{
    public async Task<CreateGroupResponse> CreateGroupAsync(CreateGroupRequest request, Guid userId)
    {
        string joinCode = GenerateJoinCode();

        var group = new CoachingGroup 
        { 
            Id = Guid.NewGuid(), 
            Name = request.Name,
            Code = joinCode,
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
        return new CreateGroupResponse { Name = group.Name, JoinCode = joinCode };
    }

    public async Task<string> GetJoinCodeAsync(Guid groupId, Guid userId)
    {
        var group = await _db.CoachingGroups.FindAsync(groupId) 
            ?? throw new InvalidOperationException("Group not found");
        
        var isCoachInGroup = await _db.Memberships
            .AnyAsync(x => x.UserId == userId && x.CoachingGroupId == groupId && (x.Role == GroupRole.Coach || x.Role == GroupRole.Owner));

        if (!isCoachInGroup) throw new InvalidOperationException("You must be a coach in this group to view the join code");

        return group.Code;
    }

    public async Task<string> RotateJoinCodeAsync(Guid groupId, Guid userId)
    {
        var group = await _db.CoachingGroups.FindAsync(groupId) 
            ?? throw new InvalidOperationException("Group not found");
        
        var isCoachInGroup = await _db.Memberships
            .AnyAsync(x => x.UserId == userId && x.CoachingGroupId == groupId && x.Role == GroupRole.Owner);

        if (!isCoachInGroup) throw new InvalidOperationException("You must be the group owner to rotate the join code");
            
        string newCode;
        do {
            newCode = GenerateJoinCode();
        } while (await _db.CoachingGroups.AnyAsync(g => g.Code == newCode));

        group.Code = newCode;
        await _db.SaveChangesAsync();

        return newCode;
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

    public async Task ApprovePendingMembership(Guid groupId, Guid clientId, Guid userId)
    {
        //TODO:
        //Fix up groups page with new styling and hook it up to the front end
        //Have navigation bar sync with current membership
        //Setup basic frontend for the dashboard
        //Finish pending membership implementation
    }

    public async Task AddClientAsync(Guid groupId, Guid clientId, Guid userId)
    {
        var isCoachInGroup = await _db.Memberships
            .AnyAsync(x => x.UserId == userId && x.CoachingGroupId == groupId && (x.Role == GroupRole.Coach || x.Role == GroupRole.Owner));

        if (!isCoachInGroup) throw new InvalidOperationException("You must be a coach in this group to add clients");

        _db.Memberships.Add(new GroupMembership
        {
            UserId = clientId,
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

        if (!string.IsNullOrWhiteSpace(request.IncludeString))
            query = query.Where(g => g.Name.Contains(request.IncludeString) || (g.Description != null && g.Description.Contains(request.IncludeString)));

        if (request.IsPublic != null)
            query = query.Where(g => g.IsPublic == request.IsPublic);

        if (request.IsRequestToJoin != null)
            query = query.Where(g => g.IsRequestToJoin == request.IsRequestToJoin);

        var userMembershipGroupIds = _db.Memberships
            .Where(m => m.UserId == userId)
            .Select(m => m.CoachingGroupId)
            .ToHashSet();

        var otherUserMembershipGroupIds = request.OtherUserId != null
            ? [.. _db.Memberships
                .Where(m => m.UserId == request.OtherUserId)
                .Select(m => m.CoachingGroupId)]
            : new HashSet<Guid>();

        //Filter wether the sender is in the groups
        if (request.IsUserInGroup is true)
            query = query.Where(g => userMembershipGroupIds.Contains(g.Id));

        if (request.IsUserInGroup is false)
            query = query.Where(g => !userMembershipGroupIds.Contains(g.Id));

        // Filter wether the requested user is in the groups
        if (request.IsOtherUserInGroup is true)
            query = query.Where(g => otherUserMembershipGroupIds.Contains(g.Id));

        if (request.IsOtherUserInGroup is false)
            query = query.Where(g => !otherUserMembershipGroupIds.Contains(g.Id));

        var groups = await query.ToListAsync();

        return new GetGroupResponse{ Groups = groups.ToDtoList() };
    }

    public string GenerateJoinCode()
    {
        const int length = 8;
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var bytes = RandomNumberGenerator.GetBytes(length);
        var result = new char[length];

        for (int i = 0; i < length; i++)
            result[i] = chars[bytes[i] % chars.Length];

        return new string(result);
    }
}