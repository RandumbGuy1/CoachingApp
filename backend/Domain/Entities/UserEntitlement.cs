namespace CoachApi.Domain.Entities;

public class UserEntitlement
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    public required string ProductCode { get; set; } // e.g. "TOOLS_PACK", "QUICKSTART", "COACHING"
    public DateTime? Expiration { get; set; }

    public bool IsActive => Expiration == null || DateTime.UtcNow < Expiration;
}
