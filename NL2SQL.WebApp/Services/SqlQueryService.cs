using NL2SQL.WebApp.Models.AiGenerate.Response;
using NL2SQL.WebApp.Models.Message.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;
using NuGet.Packaging;

namespace NL2SQL.WebApp.Services
{
    public class SqlQueryService : ISqlQueryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVannaService _vannaService;

        public SqlQueryService(IUnitOfWork unitOfWork, IVannaService vannaService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _vannaService = vannaService ?? throw new ArgumentNullException(nameof(vannaService));
        }

        public async Task<GeneralNlpQueryResponseModel> ExecuteAISqlAsync(IList<SQLGenerationModel> generationModels)
        {
            var result = await _unitOfWork.ExecuteAIGeneratedSqlAsync(generationModels);

            if (result == null)
                throw new InvalidOperationException("Failed to execute SQL query");

            return result;
        }

        public async Task<List<SQLGenerationModel>> GenerateSqlAsync(string query, int chatId, string model = "openAi")
        {
            var resultGeneration = new SqlGenerationResultModel(new List<SQLGenerationModel>(), null);

            var resultAiGeneration = await _vannaService.GenerateSqlAsync(query, chatId, model);

            if (resultAiGeneration.GenerationSql != null && resultAiGeneration.GenerationSql.Any())
                resultGeneration.GenerationSql.AddRange(resultAiGeneration.GenerationSql);

            if (resultGeneration is not { ErrorMessage: null })
                throw new InvalidOperationException("Failed to generate SQL query");

            return resultGeneration.GenerationSql.ToList();
        }
    }
}