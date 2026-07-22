using CoachApi.Application.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;
using CoachApi.API.Extensions;
using CoachApi.Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace CoachApi.API.Controllers;

[ApiController]

[Route("api/auth")]
public class AuthController(AuthService _authService) : ControllerBase
{
    [Authorize(Roles = "Free,Lite,Pro")]
    [HttpPost("save")]
    public async Task<IActionResult> SaveUser([FromBody] SaveUserRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var userDto = await _authService.SaveUserAsync(request, userId);
            return Ok(userDto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

