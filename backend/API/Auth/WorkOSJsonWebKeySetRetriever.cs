using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Tokens;

namespace CoachApi.API.Auth;

public class WorkOsJsonWebKeySetRetriever : IConfigurationRetriever<JsonWebKeySet>
{
    public async Task<JsonWebKeySet> GetConfigurationAsync(string address, IDocumentRetriever retriever, CancellationToken cancel)
    {
        var document = await retriever.GetDocumentAsync(address, cancel);
        return JsonWebKeySet.Create(document);
    }
}