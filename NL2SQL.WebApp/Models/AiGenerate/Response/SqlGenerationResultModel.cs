using NL2SQL.WebApp.Models.Message.Response;

namespace NL2SQL.WebApp.Models.AiGenerate.Response
{
    public record SqlGenerationResultModel(IList<SQLGenerationModel>? GenerationSql, string? ErrorMessage);
}
