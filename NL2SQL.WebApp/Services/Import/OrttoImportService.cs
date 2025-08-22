using Microsoft.IdentityModel.Tokens;
using NL2SQL.WebApp.Models.Ortto.Request;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;
using NL2SQL.WebApp.Utils;

namespace NL2SQL.WebApp.Services.Import
{
    public class OrttoImportService : IOrttoImportService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOrttoApiService _orttoApiService;
        private const int DefaultImportLimit = 100;
        private const int ApiDelayMilliseconds = 1000;
        private const int ActivityDelayMilliseconds = 500;

        public OrttoImportService(IUnitOfWork unitOfWork, IOrttoApiService orttoApiService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _orttoApiService = orttoApiService ?? throw new ArgumentNullException(nameof(orttoApiService));
        }

        public async Task<OrttoImportStatsModel> ImportOrttoDataAsync(OrttoImportOptionsModel options)
        {
            var stats = new OrttoImportStatsModel();

            if (options == null)
                return stats;

            if (options.Setup)
                await _unitOfWork.Ortto.SetupDatabaseAsync();

            try
            {
                if (options.ImportData)
                {
                    var personIds = await ImportPersonsAsync(options.Limit);
                    stats.Persons = personIds.Count;
                    stats.Organizations = await ImportOrganizationsAsync(options.Limit);
                    stats.Activities = await ImportActivitiesAsync(personIds);
                }

                if (options.MatchFreshdesk)
                    stats.FreshdeskMatches = await _unitOfWork.Ortto.MatchWithFreshdeskContactsAsync();

                if (options.MatchPipedrive)
                    stats.FreshdeskMatches = await _unitOfWork.Ortto.MatchWithPipedriveDataAsync();

                stats.IsImporting = true;

                stats.TotalRecords = stats.Persons + stats.Organizations + stats.Activities + stats.FreshdeskMatches + stats.PipedriveMatches;
            }
            catch (Exception)
            {
                return stats;
            }

            return stats;
        }

        private async Task<List<string>> ImportPersonsAsync(int? limit)
        {
            var personIds = new List<string>();

            var (totalImported, _) = await ImportBatchAsync(
                async (batchSize, cursor) =>
                {
                    var (persons, nextCursor) = await _orttoApiService.FetchOrttoPersonsAsync(batchSize, cursor);
                    var ids = persons.Select(p => p.Id).Where(id => !string.IsNullOrEmpty(id)).ToList();
                    personIds.AddRange(ids);
                    return (persons, nextCursor);
                },
                _unitOfWork.Ortto.StorePersonsAsync,
                limit);

            return personIds;
        }

        private async Task<int> ImportOrganizationsAsync(int? limit)
        {
            var (totalImported, _) = await ImportBatchAsync(
                (batchSize, cursor) => _orttoApiService.FetchOrttoOrganizationsAsync(batchSize, cursor),
                _unitOfWork.Ortto.StoreOrganizationsAsync,
                limit);

            return totalImported;
        }

        private async Task<int> ImportActivitiesAsync(List<string> personIds)
        {
            var totalActivities = 0;

            if (personIds.IsNullOrEmpty())
                return totalActivities;

            foreach (var personId in personIds)
            {
                var activities = await _orttoApiService.FetchOrttoActivitiesAsync(personId);
                if (!activities.IsNullOrEmpty() && activities.Any())
                {
                    await _unitOfWork.Ortto.StoreActivitiesAsync(activities, personId);
                    totalActivities += activities.Count;
                }

                await Task.Delay(ActivityDelayMilliseconds);
            }

            return totalActivities;
        }

        private async Task<(int TotalImported, string? NextCursor)> ImportBatchAsync<T>(
            Func<int, string?, Task<(List<T> Items, string? Cursor)>> fetchFunc,
            Func<List<T>, Task> storeFunc,
            int? limit,
            string? initialCursor = null)
        {
            var totalImported = 0;
            string? nextCursor = initialCursor;

            while (true)
            {
                var (items, cursor) = await fetchFunc(limit ?? DefaultImportLimit, nextCursor);
                if (!items.Any())
                    break;

                await storeFunc(items);
                totalImported += items.Count;
                nextCursor = cursor;

                if (limit.HasValue && totalImported >= limit.Value)
                    break;

                if (string.IsNullOrEmpty(nextCursor))
                    break;

                await Task.Delay(ApiDelayMilliseconds);
            }

            return (totalImported, nextCursor);
        }
    }
}