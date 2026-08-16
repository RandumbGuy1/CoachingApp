using CoachApi.Application.Contracts.Requests;
using CoachApi.Application.Contracts.Responses;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace CoachApi.Application.Services;

public class CheckoutService(AppDbContext _db, StripeClient _client, StripeCatalogService _catalog, IConfiguration _config)
{
    public async Task<CheckoutSessionResponse> CreateSessionAsync(CreateCheckoutSessionRequest request, Guid userId)
    {
        var components = new List<StripeComponent>();
        foreach (var itemId in request.ItemIds) components.AddRange(await _catalog.GetBundleComponentsAsync(itemId));

        components = [.. components.DistinctBy(c => c.PriceId)];

        if (components.Count == 0) throw new Exception("No components found for the provided item IDs.");

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new InvalidOperationException("User not found.");

        if (user.StripeCustomerId == null)
        {
            var customer = await _client.V1.Customers.CreateAsync(new CustomerCreateOptions
            {
                Email = user.Email,
                Metadata = new Dictionary<string, string> { ["app_user_id"] = user.Id.ToString() }
            });

            user.StripeCustomerId = customer.Id;
            await _db.SaveChangesAsync();
        }

        var options = new SessionCreateOptions
        {
            Customer = user.StripeCustomerId,
            ClientReferenceId = userId.ToString(),
            Mode = components.Any(c => c.IsRecurring) ? "subscription" : "payment",
            SuccessUrl = _config["Stripe:SuccessUrl"],
            CancelUrl = _config["Stripe:CancelUrl"],
            LineItems = [.. components.Select(c => new SessionLineItemOptions
            {
                Price = c.PriceId,
                Quantity = 1
            })]
        };

        var session = await _client.V1.Checkout.Sessions.CreateAsync(options);
        return new CheckoutSessionResponse { Url = session.Url };
    }
}