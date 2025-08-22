using NL2SQL.WebApp.Models.Ortto.Request;

namespace NL2SQL.WebApp.Services.Import.Interfaces
{
    public interface IOrttoImportService
    {
        Task<OrttoImportStatsModel> ImportOrttoDataAsync(OrttoImportOptionsModel options);
    }
}
