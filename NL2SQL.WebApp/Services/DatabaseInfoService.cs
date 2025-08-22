using NL2SQL.WebApp.Models.Database.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services
{
    public class DatabaseInfoService : IDatabaseInfoService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DatabaseInfoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<SqlOperationResultModel> ExecuteSqlAsync(string sql)
        {
            var result = await _unitOfWork.ExecuteSqlAsync(sql);
            return result;
        }

        public async Task<string> GetAvailableTablesServiceAsync()
        {
            var result = await _unitOfWork.DatabaseMetadata.GetAvailableTablesServiceAsString();
            return result;
        }

        public async Task<DatabaseSchemaModel> GetDatabaseSchemaAsync()
        {
            var result = await _unitOfWork.DatabaseMetadata.GetDatabaseSchemaAsync();
            return result;
        }

        public IList<string> GetDatabaseTablesService()
        {
            return _unitOfWork.DatabaseMetadata.GetDatabaseTablesService();
        }

        public async Task<TableSchemaModel> GetTableSchemaAsync(string tableName)
        {
            return await _unitOfWork.DatabaseMetadata.GetTableSchemaAsync(tableName);
        }
    }
}
