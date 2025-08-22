using NL2SQL.WebApp.Models.Freshdesk.Request;

namespace NL2SQL.WebApp.Services.Import.Interfaces
{
    public interface IFreshdeskImportService
    {
        Task<FreshdeskImportStatsModel> FetchAndImportAllDataAsync(FreshdeskImportOptionsModel options);
    }
}
