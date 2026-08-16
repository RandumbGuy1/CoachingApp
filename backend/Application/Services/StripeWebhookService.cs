using CoachApi.Domain.Entities;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace CoachApi.Application.Services;

public class StripeWebhookService(AppDbContext _db, StripeClient _client, EntitlementService _entitlements, SessionLineItemService _sessionLineItems)
{
    public async Task HandleEventAsync(Event stripeEvent)
    {
        if (await _db.ProcessedStripeEvents.FindAsync(stripeEvent.Id) != null) return;

        switch (stripeEvent.Type)
        {
            case "checkout.session.completed":
                if (stripeEvent.Data.Object is Session session)
                    await HandleCheckoutSessionCompletedAsync(session);
                break;

            case "invoice.paid":
                if (stripeEvent.Data.Object is Invoice invoice)
                    await HandleInvoicePaidAsync(invoice);
                break;
        }

        _db.ProcessedStripeEvents.Add(new ProcessedStripeEvent { StripeEventId = stripeEvent.Id });
        await _db.SaveChangesAsync();
    }

    private async Task HandleCheckoutSessionCompletedAsync(Session session)
    {
        if (session.ClientReferenceId == null) return;
        if (!Guid.TryParse(session.ClientReferenceId, out var userId)) return;

        var lineItems = await _sessionLineItems.ListAsync(session.Id, new SessionLineItemListOptions
        {
            Expand = ["data.price"]
        });

        //Handle Reccurring components (subscription is non null)
        var periodEndsByPriceId = new Dictionary<string, DateTime>();
        if (session.SubscriptionId != null)
        {
            var subscription = await _client.V1.Subscriptions.GetAsync(session.SubscriptionId, new SubscriptionGetOptions
            {
                Expand = ["items.data.price"]
            });

            foreach (var item in subscription.Items.Data) periodEndsByPriceId[item.Price.Id] = item.CurrentPeriodEnd;
        }

        //Handle everything once the subs are configured
        foreach (var lineItem in lineItems.Data)
        {
            if (!lineItem.Price.Metadata.TryGetValue("app_component_id", out var componentId) || string.IsNullOrEmpty(componentId))
                continue;
            
            DateTime? expiration = periodEndsByPriceId.TryGetValue(lineItem.Price.Id, out var periodEnd) ? periodEnd : null;
            await _entitlements.GrantAsync(userId, componentId, expiration);
        }

        await _db.SaveChangesAsync();
    }

    private async Task HandleInvoicePaidAsync(Invoice invoice)
    {
        if (invoice.BillingReason != "subscription_cycle") return;

        var user = await _db.Users.FirstOrDefaultAsync(user => user.StripeCustomerId == invoice.CustomerId);
        if (user == null) return;

        var fullInvoice = await _client.V1.Invoices.GetAsync(invoice.Id, new InvoiceGetOptions
        {
            Expand = ["lines.data.pricing.price_details.price"]
        });

        foreach (var line in fullInvoice.Lines.Data)
        {
            var price = line.Pricing?.PriceDetails?.Price;
            if (price == null || !price.Metadata.TryGetValue("app_component_id", out var componentId) || string.IsNullOrEmpty(componentId))
                continue;

            await _entitlements.GrantAsync(user.Id, componentId, line.Period.End);
        }

        await _db.SaveChangesAsync();
    }
}