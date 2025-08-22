using NL2SQL.WebApp.Models.Pipedrive.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IPipedriveApiService
    {
        Task<List<PipedriveOrganizationModel>> FetchOrganizationsAsync(string since = null, int limit = 100);
        Task<List<PipedriveContactModel>> FetchContactsAsync(string since = null, int limit = 100);
        Task<List<PipedriveDealModel>> FetchDealsAsync(string since = null, int limit = 100);
        Task<List<PipedriveActivityModel>> FetchActivitiesAsync(string since = null, int limit = 100);
    }
}
