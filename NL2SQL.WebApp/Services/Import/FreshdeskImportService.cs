using Microsoft.IdentityModel.Tokens;
using NL2SQL.WebApp.Models.Freshdesk.Request;
using NL2SQL.WebApp.Models.Freshdesk.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;
using NL2SQL.WebApp.Utils;

namespace NL2SQL.WebApp.Services.Import
{
    public class FreshdeskImportService : IFreshdeskImportService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFreshdeskApiService _freshdeskApiService;

        public FreshdeskImportService(
            IUnitOfWork unitOfWork,
            IFreshdeskApiService freshdeskApiService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _freshdeskApiService = freshdeskApiService ?? throw new ArgumentNullException(nameof(freshdeskApiService));
        }

        public async Task<FreshdeskImportStatsModel> FetchAndImportAllDataAsync(FreshdeskImportOptionsModel options)
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));

            var stats = new FreshdeskImportStatsModel { IsImporting = true };
            var verifySsl = !options.Insecure;

            await _unitOfWork.Freshdesk.SetupDatabaseAsync();

            if (ShouldImportEntity(options.Entities, "agents") && !options.TicketId.HasValue)
            {
                stats.TotalRecords += await ImportAgentsAsync(verifySsl, options.BatchSize);
            }

            if (ShouldImportEntity(options.Entities, "contacts") && !options.TicketId.HasValue)
            {
                stats.TotalRecords += await ImportContactsAsync(verifySsl, options.BatchSize);
            }

            if (ShouldImportEntity(options.Entities, "companies") && !options.TicketId.HasValue)
            {
                stats.TotalRecords += await ImportCompaniesAsync(verifySsl, options.BatchSize);
            }

            if (ShouldImportEntity(options.Entities, "tickets"))
            {
                await ImportTicketsWithConversationsAsync(options, verifySsl, stats);
            }

            stats.IsImporting = true;

            return stats;
        }

        private bool ShouldImportEntity(string entities, string entityName)
        {
            return entities == "all" || entities.Contains(entityName, StringComparison.OrdinalIgnoreCase);
        }

        private async Task<int> ImportAgentsAsync(bool verifySsl, int limit)
        {
            var agents = await _freshdeskApiService.GetAgentsAsync(verifySsl, limit);
            return agents.IsNullOrEmpty() ? 0 : await _unitOfWork.Freshdesk.ImportAgentsAsync(agents);
        }

        private async Task<int> ImportContactsAsync(bool verifySsl, int limit)
        {
            int totalImported = 0;

            while (true)
            {
                var contacts = await _freshdeskApiService.GetContactsAsync(verifySsl, limit);
                if (contacts.IsNullOrEmpty())
                    break;

                totalImported += await _unitOfWork.Freshdesk.ImportContactsAsync(contacts);
                if (contacts.Count <= limit)
                    break;
            }

            return totalImported;
        }

        private async Task<int> ImportCompaniesAsync(bool verifySsl, int limit)
        {
            int totalImported = 0;

            while (true)
            {
                var companies = await _freshdeskApiService.GetCompaniesAsync(verifySsl, limit);
                if (companies.IsNullOrEmpty())
                    break;

                totalImported += await _unitOfWork.Freshdesk.ImportCompaniesAsync(companies);
                if (companies.Count <= limit)
                    break;
            }

            return totalImported;
        }

        private async Task ImportTicketsWithConversationsAsync(
            FreshdeskImportOptionsModel options,
            bool verifySsl,
            FreshdeskImportStatsModel stats)
        {
            if (options.TicketId.HasValue && options.TicketId != 0)
            {
                await ProcessSingleTicketAsync(options.TicketId.Value, verifySsl, options.Conversations, stats);
            }
            else
            {
                await ProcessAllTicketsAsync(options, verifySsl, stats);
            }
        }

        private async Task ProcessSingleTicketAsync(
            int ticketId,
            bool verifySsl,
            bool importConversations,
            FreshdeskImportStatsModel stats)
        {
            var ticket = await _freshdeskApiService.GetTicketByIdAsync(ticketId, verifySsl);
            if (ticket != null)
            {
                stats.TotalRecords += await _unitOfWork.Freshdesk.ImportTicketsAsync(new List<TicketModel> { ticket });

                if (importConversations)
                {
                    var conversations = await _freshdeskApiService.GetConversationsAsync(ticketId, verifySsl);
                    if (conversations.Count > 0)
                    {
                        stats.TotalRecords += await _unitOfWork.Freshdesk.ImportConversationsAsync(conversations, ticketId);
                    }
                }
            }
        }

        private async Task ProcessAllTicketsAsync(
            FreshdeskImportOptionsModel options,
            bool verifySsl,
            FreshdeskImportStatsModel stats)
        {
            DateTime? since = options.Since != null ? DateTime.Parse(options.Since) : null;
            DateTime until = options.Until != null ? DateTime.Parse(options.Until) : DateTime.Now;
            var startDate = since?.ToString("yyyy-MM-dd") ?? "2015-01-01";
            var endDate = until.ToString("yyyy-MM-dd");

            var allTickets = await _freshdeskApiService.GetTicketsAsync(options.BatchSize, since, verifySsl);

            if (allTickets.IsNullOrEmpty() || allTickets.Count < options.BatchSize)
            {
                var searchTickets = await _freshdeskApiService.GetAllTicketsFromSearchAsync(options.BatchSize, startDate, endDate, verifySsl);
                if (!allTickets.IsNullOrEmpty())
                {
                    var existingIds = allTickets.Select(t => t.Id).ToHashSet();
                    allTickets.AddRange(searchTickets.Where(t => !existingIds.Contains(t.Id)));
                }
                else
                {
                    allTickets = searchTickets;
                }
            }

            if (!allTickets.IsNullOrEmpty())
            {
                stats.TotalRecords += await _unitOfWork.Freshdesk.ImportTicketsAsync(allTickets);

                if (options.Conversations)
                {
                    await ProcessConversationsParallelAsync(
                        allTickets.Select(t => t.Id).ToList(),
                        verifySsl,
                        options.ParallelThreads,
                        stats);
                }
            }
        }

        private async Task ProcessConversationsParallelAsync(
            List<int> ticketIds,
            bool verifySsl,
            int parallelThreads,
            FreshdeskImportStatsModel stats)
        {
            var options = new ParallelOptions { MaxDegreeOfParallelism = parallelThreads };
            await Parallel.ForEachAsync(ticketIds, options, async (ticketId, ct) =>
            {
                var conversations = await _freshdeskApiService.GetConversationsAsync(ticketId, verifySsl);
                if (!conversations.IsNullOrEmpty())
                {
                    stats.TotalRecords += await _unitOfWork.Freshdesk.ImportConversationsAsync(conversations, ticketId);
                }
            });
        }
    }
}