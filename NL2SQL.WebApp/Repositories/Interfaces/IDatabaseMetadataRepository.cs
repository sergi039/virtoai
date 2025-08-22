using NL2SQL.WebApp.Models.Database.Response;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IDatabaseMetadataRepository
    {
        Task<string> GetAvailableTablesServiceAsString();
        IList<string> GetDatabaseTablesService();
        Task<DatabaseSchemaModel> GetDatabaseSchemaAsync();
        Task<TableSchemaModel> GetTableSchemaAsync(string tableName);
    }
}
