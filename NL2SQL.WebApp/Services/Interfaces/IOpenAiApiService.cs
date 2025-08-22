using NL2SQL.WebApp.Models.AiGenerate.Request;
using NL2SQL.WebApp.Models.AiGenerate.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IOpenAiApiService
    {
        Task<IList<string>> GenerateFieldContextAsync(RequestGenerateFieldContextModel model);

        Task<bool> IsChainBrokenAsync(string query, int chatId);

        Task<bool> CheckUserQueryInRagSystemAsync(string query); 

        Task<GenerateClarifyingModel> GenerateClarifyingAsync(string userQuery, int chatId);
    }
}
