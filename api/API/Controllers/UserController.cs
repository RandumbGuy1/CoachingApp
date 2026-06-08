using Microsoft.AspNetCore.Mvc;
using CoachApi.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Services;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/users")]
public class UserController(UserService userService) : ControllerBase
{
    private readonly UserService _userService = userService;

    [Authorize(Roles = "Free,Pro,Enterprise")]
    [HttpGet("me")]
    public async Task<IActionResult> GetUser()
    {
        try
        {
            var userId = User.GetUserId();
            var response = _userService.GetUserAsync(userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Free,Pro,Enterprise")]
    [HttpGet("me/profile")]
    public async Task<IActionResult> GetUserProfile()
    {
        try
        {
            var userId = User.GetUserId();
            var response = _userService.GetUserProfileAsync(userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Free,Pro,Enterprise")]
    [HttpPost("me/profile/save")]
    public async Task<IActionResult> SaveUserProfile([FromBody] SaveProfileRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var response = _userService.SaveUserProfileAsync(request, userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Free,Pro,Enterprise")]
    [HttpPost("me/profile/avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile avatar)
    {
        try
        {
            var userId = User.GetUserId();
            var response = _userService.UploadAvatarAsync(avatar, userId);
            return Ok(response);
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }
}
