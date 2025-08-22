using NL2SQL.WebApp.Models.Ortto.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IOrttoApiService
    {
        Task FetchAndImportAllDataAsync();
        Task<(List<OrttoPersonModel> Persons, string NextCursor)> FetchOrttoPersonsAsync(int limit = 100, string cursor = null);
        Task<(List<OrttoOrganizationModel> Organizations, string NextCursor)> FetchOrttoOrganizationsAsync(int limit = 100, string cursor = null);
        Task<List<OrttoActivityModel>> FetchOrttoActivitiesAsync(string personId);
    }
}
