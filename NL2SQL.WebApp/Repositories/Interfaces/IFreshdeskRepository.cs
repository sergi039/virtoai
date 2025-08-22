using NL2SQL.WebApp.Models.Freshdesk.Response;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IFreshdeskRepository
    {
        Task SetupDatabaseAsync();

        Task<int> ImportAgentsAsync(IReadOnlyList<AgentModel> agents);

        Task<int> ImportContactsAsync(IReadOnlyList<ContactModel> contacts);

        Task<int> ImportCompaniesAsync(IReadOnlyList<CompanyModel> companies);

        Task<int> ImportTicketsAsync(IReadOnlyList<TicketModel> tickets, DateTime? since = null, int batchSize = 100);

        Task<int> ImportConversationsAsync(IReadOnlyList<ConversationModel> conversations, int? ticketId = null);
    }
}
