using NL2SQL.WebApp.Models.Pipedrive.Request;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services.Import
{
    public class PipedriveImportService : IPipedriveImportService
    {
        private readonly IPipedriveApiService _pipedriveApiService;
        private readonly IUnitOfWork _unitOfWork;
        private static readonly IReadOnlyList<string> AllEntitiesList = new List<string> 
        { 
            "organizations", 
            "contacts", 
            "deals", 
            "activities" 
        }.AsReadOnly();
        
        public PipedriveImportService(IPipedriveApiService pipedriveApiService, IUnitOfWork unitOfWork)
        {
            _pipedriveApiService = pipedriveApiService ?? throw new ArgumentNullException(nameof(pipedriveApiService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<PipedriveImportStatsModel> ImportPipedriveDataAsync(PipedriveImportOptionsModel options)
        {
            var stats = new PipedriveImportStatsModel();

            if (options == null)
                return stats;

            if (options.Setup)
                await _unitOfWork.Pipedrive.SetupDatabaseAsync();

            var entitiesToImport = options.Entities.Contains("all")
                ? AllEntitiesList
                : options.Entities;

            if (entitiesToImport.Any())
            {
                if (entitiesToImport.Contains("organizations"))
                {
                    var organizations = await _pipedriveApiService.FetchOrganizationsAsync(limit: options.Limit);
                    stats.Organizations = await _unitOfWork.Pipedrive.ImportOrganizationsAsync(organizations);
                }

                if (entitiesToImport.Contains("contacts"))
                {
                    var contacts = await _pipedriveApiService.FetchContactsAsync(limit: options.Limit);
                    stats.Contacts = await _unitOfWork.Pipedrive.ImportContactsAsync(contacts);
                }

                if (entitiesToImport.Contains("deals"))
                {
                    var deals = await _pipedriveApiService.FetchDealsAsync(limit: options.Limit);
                    stats.Deals = await _unitOfWork.Pipedrive.ImportDealsAsync(deals);
                }

                if (entitiesToImport.Contains("activities"))
                {
                    var activities = await _pipedriveApiService.FetchActivitiesAsync(limit: options.Limit);
                    stats.Activities = await _unitOfWork.Pipedrive.ImportActivitiesAsync(activities);
                }
            }

            if (options.MatchFreshdesk)
                stats.Matches = await _unitOfWork.Pipedrive.MatchContactsWithFreshdeskAsync();

            stats.IsImporting = true;

            stats.TotalRecords = stats.Organizations + stats.Contacts + stats.Deals + stats.Activities + stats.Matches;

            return stats;
        }
    }
}
