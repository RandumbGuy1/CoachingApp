using CoachApi.Application.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;
using CoachApi.Infrastructure.Data;
using CoachApi.API.Extensions;
using CoachApi.Application.Services;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService authService) : ControllerBase
{
    private readonly AuthService _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var authResponse = await _authService.LoginAsync(request);
            return Ok(authResponse);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var authResponse = await _authService.RegisterAsync(request);
            return Ok(authResponse);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        try
        {
            var authResponse = await _authService.RefreshTokenAsync(request);
            return Ok(authResponse);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveUser([FromBody] SaveUserRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var authResponse = await _authService.SaveUserAsync(request, userId);
            return Ok(authResponse);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

