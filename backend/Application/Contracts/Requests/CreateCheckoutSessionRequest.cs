namespace CoachApi.Application.Contracts.Requests;

public class CreateCheckoutSessionRequest
{
    public required List<string> ItemIds { get; set; }
}