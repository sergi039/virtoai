using NL2SQL.WebApp.Models.Apollo.Request;
using NL2SQL.WebApp.Models.Apollo.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;
using NL2SQL.WebApp.Utils;

namespace NL2SQL.WebApp.Services.Import
{
    public class ApolloImportService : IApolloImportService
    {
        private readonly IApolloApiService _apolloApiService;
        private readonly IUnitOfWork _unitOfWork;

        public ApolloImportService(IApolloApiService apolloApiService, IUnitOfWork unitOfWork)
        {
            _apolloApiService = apolloApiService;
            _unitOfWork = unitOfWork;
        }

        public async Task<ApolloImportStatsModel> ImportApolloDataAsync(ApolloImportOptionsModel options)
        {
            var stats = new ApolloImportStatsModel();

            if (options == null)
                return stats;

            if (options.Setup)
                await _unitOfWork.Apollo.SetupDatabaseAsync();

            List<ApolloContactModel> contacts = new List<ApolloContactModel>();

            if (!string.IsNullOrEmpty(options.Domain))
            {
                contacts = await _apolloApiService.SearchContactsAsync(new Dictionary<string, object>
                {
                    { "q_organization_domains", options.Domain },
                    { "page", 1 },
                    { "per_page", options.Limit }
                });
            }
            else if (!string.IsNullOrEmpty(options.EmailDomain))
            {
                contacts = await _apolloApiService.SearchContactsAsync(new Dictionary<string, object>
                {
                    { "q_email_domains", options.EmailDomain },
                    { "page", 1 },
                    { "per_page", options.Limit }
                });
            }
            else if (!string.IsNullOrEmpty(options.NameUser))
            {
                contacts = await _apolloApiService.SearchContactsAsync(new Dictionary<string, object>
                {
                    { "q_keywords", options.NameUser },
                    { "page", 1 },
                    { "per_page", options.Limit }
                });
            }

            if (!contacts.IsNullOrEmpty() && contacts.Any())
                stats.TotalRecords += await _unitOfWork.Apollo.ImportApolloDataAsync(contacts);

            if (options.MatchFreshdesk)
                stats.FreshdeskMatches = await _unitOfWork.Apollo.MatchWithFreshdeskAsync();

            if (options.MatchPipedrive)
                stats.PipedriveMatches = await _unitOfWork.Apollo.MatchWithPipedriveAsync();

            stats.Counts = await _unitOfWork.Apollo.GetCountsAsync();
            stats.IsImporting = true;

            return stats;
        }
    }
}
