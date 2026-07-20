using CoachApi.Application.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CoachApi.API.Extensions;
using CoachApi.Application.Services;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/groups")]
public class GroupController(GroupService _groupService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Pro")]
    public async Task<IActionResult> CreateGroup(CreateGroupRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var createResponse = await _groupService.CreateGroupAsync(request, userId);
            return Ok(createResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("join/{groupId}")]
    [Authorize(Roles = "Free,Lite,Pro")]
    public async Task<IActionResult> JoinGroup(Guid groupId, [FromBody] JoinCodeRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var joinResponse = await _groupService.JoinGroupAsync(groupId, request, userId);
            return Ok(joinResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("join/code")]
    [Authorize(Roles = "Free,Lite,Pro")]
    public async Task<IActionResult> JoinGroupViaCode([FromBody] JoinCodeRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var joinResponse = await _groupService.JoinGroupViaCodeAsync(request, userId);
            return Ok(joinResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("add/{groupId}/{userId}")]
    [Authorize(Roles = "Pro")]
    public async Task<IActionResult> AddClient(Guid groupId, Guid userId)
    {
        try
        {
            var coachId = User.GetUserId();
            await _groupService.AddClientAsync(groupId, userId, coachId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("promote/{groupId}/{userId}")]
    [Authorize(Roles = "Pro")]
    public async Task<IActionResult> PromoteUser(Guid groupId, Guid userId)
    {
        try {
            var coachId = User.GetUserId();
            await _groupService.PromoteUserAsync(groupId, userId, coachId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("transfer/{groupId}/{userId}")]
    [Authorize(Roles = "Pro")]
    public async Task<IActionResult> TransferOwnership(Guid groupId, Guid userId)
    {
        try
        {
            var ownerId = User.GetUserId();
            await _groupService.TransferOwnershipAsync(groupId, userId, ownerId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("get")]
    [Authorize(Roles = "Free,Lite,Pro")]
    public async Task<IActionResult> GetGroups([FromQuery] GetGroupRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var groups = await _groupService.GetGroupsAsync(request, userId);
            return Ok(groups);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

