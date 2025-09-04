using NL2SQL.WebApp.Models.Apollo.Request;

namespace NL2SQL.WebApp.Services.Import.Interfaces
{
    public interface IApolloImportService
    {
        Task<ApolloImportStatsModel> ImportApolloDataAsync(ApolloImportOptionsModel? options);
    }
}
