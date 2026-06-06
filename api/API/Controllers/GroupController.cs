using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Contracts.Responses;
using CoachApi.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CoachApi.Extensions;

namespace CoachApi.Controllers
{
    [ApiController]
    [Route("api/groups")]
    public class GroupController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _db = context;

        [HttpPost]
        [Authorize(Roles = "Pro,Enterprise")]
        public async Task<IActionResult> CreateGroup(CreateGroupRequest request)
        {
            var userId = User.GetUserId();

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

            //Doing this is enough to link the coach to the group
            _db.Memberships.Add(new GroupMembership
            {
                UserId = userId,
                CoachingGroupId = group.Id,
                Role = GroupRole.Owner
            });

            await _db.SaveChangesAsync();
            return Ok(new CreateGroupResponse { Name = group.Name });
        }

        [HttpPost("{groupId}/join")]
        [Authorize(Roles = "Free,Pro,Enterprise")]
        public async Task<IActionResult> JoinGroup(Guid groupId)
        {
            var userId = User.GetUserId();

            var existsInGroup = await _db.Memberships
                .AnyAsync(x => x.UserId == userId && x.CoachingGroupId == groupId);

            if (existsInGroup) return BadRequest("Already in this group");

            _db.Memberships.Add(new GroupMembership
            {
                UserId = userId,
                CoachingGroupId = groupId,
                Role = GroupRole.Client
            });

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{groupId}/add/{userId}")]
        [Authorize(Roles = "Pro,Enterprise")]
        public async Task<IActionResult> AddClient(Guid groupId, Guid userId)
        {
            //Make sure that the coach is part of the group before allowing them to add clients to it
            var coachId = User.GetUserId();
            var isCoachInGroup = await _db.Memberships
                .Select(x => x.UserId == coachId && x.CoachingGroupId == groupId && (x.Role == GroupRole.Coach || x.Role == GroupRole.Owner))
                .AnyAsync();

            if (!isCoachInGroup) return Forbid();

            _db.Memberships.Add(new GroupMembership
            {
                UserId = userId,
                CoachingGroupId = groupId,
                Role = GroupRole.Client
            });

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{groupId}/promote/{userId}")]
        [Authorize(Roles = "Pro,Enterprise")]
        public async Task<IActionResult> PromoteUser(Guid groupId, Guid userId)
        {
            var coachId = User.GetUserId();

            //Make sure that the coach is part of the group before allowing them to promote clients
            var isCoachInGroup = await _db.Memberships
                .AnyAsync(x => x.UserId == coachId && x.CoachingGroupId == groupId && (x.Role == GroupRole.Coach || x.Role == GroupRole.Owner));

            if (!isCoachInGroup)
                return Forbid();

            var membership = await _db.Memberships.FirstOrDefaultAsync(x => x.UserId == userId && x.CoachingGroupId == groupId);
            if (membership == null)
                return NotFound();
            
            if (membership.Role == GroupRole.Coach || membership.Role == GroupRole.Owner)
                return BadRequest("User is already a coach or owner");

            if (membership.UserId == coachId)
                return BadRequest("Cannot change your own role");

            membership.Role = GroupRole.Coach;

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{groupId}/transfer/{userId}")]
        [Authorize(Roles = "Pro,Enterprise")]
        public async Task<IActionResult> TransferOwnership(Guid groupId, Guid userId)
        {
            var ownerId = User.GetUserId();

            //Make sure that the user is owner of the group before allowing them to transfer ownership
            var ownerMembership = await _db.Memberships
                .FirstOrDefaultAsync(x => x.UserId == ownerId && x.CoachingGroupId == groupId && x.Role == GroupRole.Owner);
            if (ownerMembership == null)
                return Forbid();

            var membership = await _db.Memberships.FirstOrDefaultAsync(x => x.UserId == userId && x.CoachingGroupId == groupId);
            if (membership == null)
                return NotFound();
            
            if (membership.Role == GroupRole.Client)
                return BadRequest("User must be a coach to be promoted to owner");

            if (membership.UserId == ownerId)
                return BadRequest("Cannot transfer ownership to yourself");

            membership.Role = GroupRole.Owner;
            ownerMembership.Role = GroupRole.Coach;

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("get/{filter?}")]
        [Authorize(Roles = "Free,Pro,Enterprise")]
        public async Task<IActionResult> GetGroups(string? filter)
        {
            // var groups = await _db.CoachingGroups
            //     .Where(g => g.IsPublic)
            //     .Include(g => g.Coaches) 
            //     .Include(g => g.Clients)
            //     .ToListAsync();

            var groups = new CoachingGroup[]
            {
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 1",
                    Code = "111111",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#4FA3D1",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 2",
                    Code = "222222",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#E76F51",
                    IsPublic = true,
                    IsRequestToJoin = true
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 3",
                    Code = "333333",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#9B5DE5",
                    IsPublic = false,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 4",
                    Code = "444444",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#2A9D8F",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
                    new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 5",
                    Code = "555555",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#4FA3D1",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 6",
                    Code = "666666",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#E76F51",
                    IsPublic = true,
                    IsRequestToJoin = true
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 7",
                    Code = "777777",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#9B5DE5",
                    IsPublic = false,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 8",
                    Code = "888888",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#2A9D8F",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
            };
                
            return Ok(groups);
        }
    }
}
