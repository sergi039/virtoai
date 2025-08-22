using NL2SQL.WebApp.Models.Pipedrive.Request;

namespace NL2SQL.WebApp.Services.Import.Interfaces
{
    public interface IPipedriveImportService
    {
        Task<PipedriveImportStatsModel> ImportPipedriveDataAsync(PipedriveImportOptionsModel options);
    }
}
