using NL2SQL.WebApp.Models.Pipedrive.Response;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IPipedriveRepository
    {
        Task SetupDatabaseAsync();

        Task<int> ImportOrganizationsAsync(IReadOnlyList<PipedriveOrganizationModel> organizations);

        Task<int> ImportContactsAsync(IReadOnlyList<PipedriveContactModel> contacts);

        Task<int> ImportDealsAsync(IReadOnlyList<PipedriveDealModel> deals);

        Task<int> ImportActivitiesAsync(IReadOnlyList<PipedriveActivityModel> activities);

        Task<int> MatchContactsWithFreshdeskAsync();
    }
}
