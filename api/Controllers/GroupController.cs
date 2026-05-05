using CoachApi.Models;
using CoachApi.Entities;
using Microsoft.AspNetCore.Mvc;
using CoachApi.Data;
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
        [Authorize(Roles = "Coach")]
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
            _db.Coaches.Add(new Coach
            {
                UserId = userId,
                CoachingGroupId = group.Id
            });

            await _db.SaveChangesAsync();
            return Ok(new CreateGroupResponse { Name = group.Name });
        }

        [HttpPost("{groupId}/join")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> JoinGroup(Guid groupId)
        {
            var userId = User.GetUserId();

            var exists = await _db.Clients
                .AnyAsync(x => x.UserId == userId && x.CoachingGroupId == groupId);

            if (exists)
                return BadRequest("Already in this group");

            _db.Clients.Add(new Client
            {
                UserId = userId,
                CoachingGroupId = groupId
            });

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{groupId}/clients/{userId}")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> AddClient(Guid groupId, Guid userId)
        {
            var coachId = User.GetUserId();

            var isCoachInGroup = await _db.Coaches
                .AnyAsync(x => x.UserId == coachId && x.CoachingGroupId == groupId);

            if (!isCoachInGroup)
                return Forbid();

            _db.Clients.Add(new Client
            {
                UserId = userId,
                CoachingGroupId = groupId
            });

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{groupId}/coaches/{userId}")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> AddCoach(Guid groupId, Guid userId)
        {
            var coachId = User.GetUserId();

            var isCoachInGroup = await _db.Coaches
                .AnyAsync(x => x.UserId == coachId && x.CoachingGroupId == groupId);

            if (!isCoachInGroup)
                return Forbid();

            _db.Clients.Add(new Client
            {
                UserId = userId,
                CoachingGroupId = groupId
            });

            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [HttpPost("public")]
        public async Task<IActionResult> GetPublicGroups()
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

        [HttpPost]
        [HttpPost("current")]
        public async Task<IActionResult> GetCurrentGroups()
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
                    Name = "Group 11",
                    Code = "111111",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#4FA3D1",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 12",
                    Code = "222222",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#E76F51",
                    IsPublic = true,
                    IsRequestToJoin = true
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 13",
                    Code = "333333",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#9B5DE5",
                    IsPublic = false,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 14",
                    Code = "444444",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#2A9D8F",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
                    new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 15",
                    Code = "555555",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#4FA3D1",
                    IsPublic = true,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 16",
                    Code = "666666",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#E76F51",
                    IsPublic = true,
                    IsRequestToJoin = true
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 17",
                    Code = "777777",
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    Color = "#9B5DE5",
                    IsPublic = false,
                    IsRequestToJoin = false
                },
                new CoachingGroup
                {
                    Id = Guid.NewGuid(), 
                    Name = "Group 18",
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
