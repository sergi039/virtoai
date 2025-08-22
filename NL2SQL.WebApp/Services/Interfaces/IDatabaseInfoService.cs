using NL2SQL.WebApp.Models.Database.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IDatabaseInfoService
    {
        IList<string> GetDatabaseTablesService();
        Task<string> GetAvailableTablesServiceAsync();
        Task<SqlOperationResultModel> ExecuteSqlAsync(string sql);
        Task<DatabaseSchemaModel> GetDatabaseSchemaAsync();
        Task<TableSchemaModel> GetTableSchemaAsync(string tableName);
    }
}
