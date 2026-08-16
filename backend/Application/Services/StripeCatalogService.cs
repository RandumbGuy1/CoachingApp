using CoachApi.Application.Configuration;
using Stripe;

namespace CoachApi.Application.Services;

//Custom wrapper around individual stripe product prices
public record StripeComponent(string AppComponentId, string PriceId, bool IsRecurring, long UnitAmount);

public class StripeCatalogService(StripeClient _client)
{
    private static readonly TimeSpan CacheTickRate = TimeSpan.FromMinutes(10);

    //This locks the operation down to a min and max of 1 thread to avoid unecessary overlapping calls refreshes
    //We wait on it within a task and release it when the operation is complete
    private readonly SemaphoreSlim _refreshLock = new(1, 1);
    private Dictionary<string, StripeComponent> _cache = [];
    private DateTime _cachedAt = DateTime.MinValue;

    public async Task<StripeComponent> GetComponentAsync(string appComponentId)
    {
        var catalog = await GetCatalogAsync();
        return catalog.TryGetValue(appComponentId, out var component) ? component 
            : throw new InvalidOperationException($"Unknown Stripe component '{appComponentId}'");
    }

    public async Task<List<StripeComponent>> GetBundleComponentsAsync(string bundleId)
    {
        if (!BundleCatalog.Bundles.TryGetValue(bundleId, out var componentIds))
            throw new InvalidOperationException($"Unknown bundle '{bundleId}'");

        var catalog = await GetCatalogAsync();
        return [.. componentIds
            .Select(id => catalog.TryGetValue(id, out var component) ? component : throw new InvalidOperationException($"Unknown Stripe component '{id}'"))
        ]; 
    }

    //Return a cached catalog of Stripe components, refreshing it if the cache is stale
    private async Task<Dictionary<string, StripeComponent>> GetCatalogAsync()
    {
        if (DateTime.UtcNow  - _cachedAt < CacheTickRate) return _cache;

        await _refreshLock.WaitAsync();
        try
        {
            if (DateTime.UtcNow  - _cachedAt < CacheTickRate) return _cache;

            var prices = await _client.V1.Prices.ListAsync(new PriceListOptions { Active = true });

            _cache = prices.Data
                .Where(price => price.Metadata.TryGetValue("app_component_id", out var id) && !string.IsNullOrEmpty(id))
                .ToDictionary(
                    price => price.Metadata["app_component_id"],
                    price => new StripeComponent(price.Metadata["app_component_id"], price.Id, price.Recurring != null, price.UnitAmount ?? 0)
                );
            
            _cachedAt = DateTime.UtcNow;
            return _cache;
        }
        finally
        {
            _refreshLock.Release();
        }
    }
}