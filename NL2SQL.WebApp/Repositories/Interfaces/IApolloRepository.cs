using NL2SQL.WebApp.Models.Apollo.Response;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IApolloRepository
    {
        Task SetupDatabaseAsync();

        Task<Dictionary<string, int>> GetCountsAsync();

        Task<int> ImportApolloDataAsync(IReadOnlyList<ApolloContactModel> contacts);

        Task<int> MatchWithFreshdeskAsync();

        Task<int> MatchWithPipedriveAsync();
    }
}
