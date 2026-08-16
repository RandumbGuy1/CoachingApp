using CoachApi.API.Extensions;
using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/checkout")]
public class CheckoutController(CheckoutService _checkoutService) : ControllerBase
{
    [HttpPost("session")]
    [Authorize(Roles = "Free,Lite,Pro")]
    public async Task<IActionResult> CreateSession([FromBody] CreateCheckoutSessionRequest request)
    {
        try
        {
            var userId = User.GetUserId();
        var response = await _checkoutService.CreateSessionAsync(request, userId);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}