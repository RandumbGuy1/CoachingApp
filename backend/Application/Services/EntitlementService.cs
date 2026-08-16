using CoachApi.Domain.Entities;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CoachApi.Application.Services;

public class EntitlementService(AppDbContext _db)
{
    // Upsert: creates the row if the user has never had this product,
    // otherwise extends/overwrites its Expiration. Caller commits (no SaveChangesAsync here).
    public async Task GrantAsync(Guid userId, string productCode, DateTime? expiration)
    {
        var entitlement = await _db.UserEntitlements.FirstOrDefaultAsync(e => e.UserId == userId && e.ProductCode == productCode);

        //Extend the expiration of this entitlement if its longer than the current expiration, or if the current expiration is null (unlimited).
        if (entitlement != null)
        {
            if (entitlement.Expiration == null) return;
            if (expiration != null && expiration <= entitlement.Expiration) return;

            entitlement.Expiration = expiration;
            return;
        }

        //Create a new entitlement row for this user and product code
        var newEntitlement = new UserEntitlement
        {
            UserId = userId,
            ProductCode = productCode,
            Expiration = expiration
        };

        _db.UserEntitlements.Add(newEntitlement);
    }

    // Returns product codes currently usable by the user (Expiration null or in the future).
    // Excludes expired/lapsed entitlements.
    public async Task<List<string>> GetActiveProductCodesAsync(Guid userId)
    {
        var entitlements = await _db.UserEntitlements
            .Where(e => e.UserId == userId)
            .ToListAsync();

        return [.. entitlements.Where(e => e.IsActive).Select(e => e.ProductCode)];
    }
}