using Microsoft.AspNetCore.Mvc;
using CoachApi.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Services;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/users")]
public class UserController(UserService _userService) : ControllerBase
{
    [Authorize(Roles = "Free,Pro,Enterprise")]
    [HttpGet("me")]
    public async Task<IActionResult> GetUser()
    {
        try
        {
            var userId = User.GetUserId();
            var response = await _userService.GetUserAsync(userId);
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
        //Note: Be careful to use "dotnet run" occasionally as launch configurations may not be properly configured
        // resulting in stale dlls being run leading to strange errors
        try
        {
            var userId = User.GetUserId();
            var response = await _userService.GetUserProfileAsync(userId);
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
            var response = await _userService.SaveUserProfileAsync(request, userId);
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
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            await _userService.UploadAvatarAsync(avatar, userId, baseUrl);
            return Ok();
        }
        catch (InvalidOperationException ex) {
            return BadRequest(ex.Message);
        }
    }
}
