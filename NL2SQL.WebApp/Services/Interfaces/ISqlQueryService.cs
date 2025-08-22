using NL2SQL.WebApp.Models.Message.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface ISqlQueryService
    {
        Task<List<SQLGenerationModel>> GenerateSqlAsync(string query, int chatId, string model = "openAi");
        Task<GeneralNlpQueryResponseModel> ExecuteAISqlAsync(IList<SQLGenerationModel> generationModels);
    }
}
