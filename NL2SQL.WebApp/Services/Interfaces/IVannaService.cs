using NL2SQL.WebApp.Models.AiGenerate.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IVannaService
    {
        Task<SqlGenerationResultModel> GenerateSqlAsync(string naturalLanguageQuery, int chatId, string? model = null);
        Task<RagKnowledgeExtractorModel> ExtractKnowledgeAsync(string naturalLanguageQuery, string? model = null);
        void ReinitializeModels();
    }
}
