using CoachApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace CoachApi.API.Controllers;

[ApiController]
[Route("api/webhooks/stripe")]
public class StripeWebhookController(StripeWebhookService _webhookService, IConfiguration _config) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var webhookSecret = _config["Stripe:WebhookSecret"]
            ?? throw new InvalidOperationException("Stripe webhook secret not configured");
        
        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                webhookSecret,
                throwOnApiVersionMismatch: false);
        }
        catch (StripeException)
        {
            return BadRequest();
        }

        await _webhookService.HandleEventAsync(stripeEvent);
        return Ok();
    }
}