using NL2SQL.WebApp.Models.Freshdesk.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IFreshdeskApiService
    {
        Task<List<AgentModel>> GetAgentsAsync(bool verifySsl, int limit);
        Task<List<ContactModel>> GetContactsAsync(bool verifySsl, int limit, int page = 1);
        Task<List<CompanyModel>> GetCompaniesAsync(bool verifySsl, int limit, int page = 1);
        Task<List<TicketModel>> GetTicketsAsync(int limit, DateTime? since, bool verifySsl);
        Task<TicketModel> GetTicketByIdAsync(int ticketId, bool verifySsl);
        Task<List<ConversationModel>> GetConversationsAsync(int ticketId, bool verifySsl);
        Task<List<TicketFieldModel>> GetTicketFieldsAsync(bool verifySsl);
        Task<SearchTicketResponseModel> SearchTicketsAsync(string query, int page, int perPage, bool verifySsl);
        Task<List<TicketModel>> GetAllTicketsFromSearchAsync(int limit, string startDate, string endDate, bool verifySsl);
        Task FetchAndImportAllDataAsync();
    }
}
