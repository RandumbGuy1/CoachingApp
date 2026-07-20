using Microsoft.AspNetCore.Mvc;
using CoachApi.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using CoachApi.Application.Services;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/memberships")]
public class MembershipController(MembershipService _membershipService) : ControllerBase
{
    [Authorize(Roles = "Free,Lite,Pro")]
    [HttpGet("me")]
    public async Task<IActionResult> GetSelectedMembership()
    {
        try
        {
            var userId = User.GetUserId();
            var response = await _membershipService.GetSelectedMembershipAsync(userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Free,Lite,Pro")]
    [HttpPost("me/save")]
    public async Task<IActionResult> SaveSelectedMembership(Guid membershipId)
    {
        try
        {
            var userId = User.GetUserId();
            var response = await _membershipService.SaveSelectedMembershipAsync(membershipId, userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Free,Lite,Pro")]
    [HttpGet("me/all")]
    public async Task<IActionResult> GetAllMemberships()
    {
        try
        {
            var userId = User.GetUserId();
            var response = await _membershipService.GetAllMembershipsAsync(userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }
}