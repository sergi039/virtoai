using NL2SQL.WebApp.Models.Apollo.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IApolloApiService
    {
        Task<List<ApolloContactModel>> SearchContactsAsync(Dictionary<string, object> parameters);
        Task<ApolloContactModel> GetContactAsync(string contactId);
        Task<ApolloOrganizationModel> GetOrganizationAsync(string organizationId);
    }
}
