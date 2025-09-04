using NL2SQL.WebApp.Models.Ortto.Response;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IOrttoRepository
    {
        Task SetupDatabaseAsync();
        Task<int> StorePersonsAsync(List<OrttoPersonModel> persons);
        Task<int> StoreOrganizationsAsync(List<OrttoOrganizationModel> organizations);
        Task<int> StoreActivitiesAsync(List<OrttoActivityModel> activities, string orttoPersonId);
        Task<int> MatchWithFreshdeskContactsAsync();
        Task<int> MatchWithPipedriveDataAsync();
        Task<List<string>> GetOrttoPersonIdsAsync();
    }
}
