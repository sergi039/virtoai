using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Models.Database.Response;
using NL2SQL.WebApp.Models.Message.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;
using NL2SQL.WebApp.Utils;
using Npgsql;
using System.Data;
using System.Data.Common;

namespace NL2SQL.WebApp.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private readonly IApolloApiService _apiApolloService;
        private IChatRepository _chats;
        private IMessageRepository _messages;
        private IOrttoRepository _orttoRepository;
        private IFreshdeskRepository _freshdeskRepository;
        private IPipedriveRepository _pipedriveRepository;
        private IApolloRepository _apolloRepository;
        private ISettingDataRepository _settingServiceRepository;
        private ISqlTrainingDataRepository _sqlTrainingDataRepository;
        private ISqlMessageRepository _sqlMessageRepository;
        private ISqlGenerationRuleRepository _sqlGenerationRuleRepository;
        private IServiceRegistryRepository _serviceRegistryRepository;
        private IServiceTableFieldRepository _serviceTableFieldRepository;
        private IServiceTableRepository _serviceTableRepository;
        private IChatUserRepository _chatUserRepository;
        private IServiceTableImplicitRelationRepository _serviceTableImplicitRelationRepository;
        private IContextMenuItemRepository _contextMenuItemRepository;
        private IDatabaseMetadataRepository _databaseMetadataRepository;
        private bool _disposed = false;
        private const string DefaultNameNullRow = "Value is null";

        public UnitOfWork(AppDbContext context, IApolloApiService apiApolloService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _apiApolloService = apiApolloService ?? throw new ArgumentNullException(nameof(apiApolloService));
        }

        public IChatRepository Chats
        {
            get { return _chats ??= new ChatRepository(_context); }
        }

        public IOrttoRepository Ortto
        {
            get { return _orttoRepository ??= new OrttoRepository(_context); }
        }

        public IFreshdeskRepository Freshdesk
        {
            get { return _freshdeskRepository ??= new FreshdeskRepository(_context); }
        }

        public IMessageRepository Messages
        {
            get { return _messages ??= new MessageRepository(_context); }
        }

        public IApolloRepository Apollo
        {
            get { return _apolloRepository ??= new ApolloRepository(_context, _apiApolloService); }
        }

        public IPipedriveRepository Pipedrive
        {
            get { return _pipedriveRepository ??= new PipedriveRepository(_context); }
        }

        public ISettingDataRepository Settings
        {
            get { return _settingServiceRepository ??= new SettingDataRepository(_context); }
        }

        public ISqlTrainingDataRepository SqlTrainingData
        {
            get { return _sqlTrainingDataRepository ??= new SqlTrainingDataRepository(_context); }
        }

        public ISqlMessageRepository SqlMessages
        {
            get { return _sqlMessageRepository ??= new SqlMessageRepository(_context); }
        }

        public ISqlGenerationRuleRepository SqlGenerationRules
        {
            get { return _sqlGenerationRuleRepository ??= new SqlGenerationRuleRepository(_context); }
        }

        public IServiceRegistryRepository ServiceRegistries
        {
            get { return _serviceRegistryRepository ??= new ServiceRegistryRepository(_context); }
        }

        public IServiceTableFieldRepository ServiceTableFields
        {
            get { return _serviceTableFieldRepository ??= new ServiceTableFieldRepository(_context);  }
        }

        public IServiceTableRepository ServiceTables
        {
            get { return _serviceTableRepository ??= new ServiceTableRepository(_context); }
        }

        public IChatUserRepository ChatUsers
        {
            get { return _chatUserRepository ??= new ChatUserRepository(_context); }
        }

        public IServiceTableImplicitRelationRepository ImplicitRelations
        {
            get { return _serviceTableImplicitRelationRepository ??= new ServiceTableImplicitRelationRepository(_context); }
        }

        public IContextMenuItemRepository ContextMenuItems
        {
            get { return _contextMenuItemRepository ??= new ContextMenuItemRepository(_context); }
        }

        public IDatabaseMetadataRepository DatabaseMetadata
        {
            get { return _databaseMetadataRepository ??= new DatabaseMetadataRepository(_context); }
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                _disposed = true;
            }
        }

        public async Task<GeneralNlpQueryResponseModel> ExecuteAIGeneratedSqlAsync(IList<SQLGenerationModel> generationModels)
        {
            if (generationModels == null || !generationModels.Any())
                throw new ArgumentNullException(nameof(generationModels), "SQL generation models cannot be null or empty.");

            var (hiddenSet, displayNameMap) = await FetchFieldMetadataAsync();
            var response = new GeneralNlpQueryResponseModel
            {
                SqlQueries = new List<NlpQueryResponseModel>()
            };

            try
            {
                using var connection = await PrepareConnectionAsync();
                await ProcessQueriesAsync(generationModels, hiddenSet, displayNameMap, response, connection);
                return response;
            }
            catch (Exception ex)
            {
                return new GeneralNlpQueryResponseModel
                {
                    SqlQueries = generationModels.Select(model => new NlpQueryResponseModel
                    {
                        Sql = model.Sql ?? string.Empty,
                        ModelName = model.Model ?? string.Empty,
                        Results = new List<Dictionary<string, object>>(),
                        ErrorMessage = $"Failed to process queries: {ex.Message}"
                    }).ToList()
                };
            }
        }

        private async Task<(HashSet<(string Table, string Column)>, Dictionary<(string Table, string Column), string>)> FetchFieldMetadataAsync()
        {
            var hiddenFields = await _context.TableFields
                .Where(h => h.IsHidden)
                .Select(h => new { TableName = h.ServiceTable.Name, ColumnName = h.Name })
                .ToListAsync();

            var displayNames = await _context.TableFields
                .Select(h => new { TableName = h.ServiceTable.Name, ColumnName = h.Name, DisplayName = h.DisplayName })
                .ToListAsync();

            var hiddenSet = new HashSet<(string Table, string Column)>(
                hiddenFields.Select(h => (h.TableName.ToLowerInvariant(), h.ColumnName.ToLowerInvariant()))
            );

            var displayNameMap = displayNames
                .GroupBy(d => (d.TableName.ToLowerInvariant(), d.ColumnName.ToLowerInvariant()))
                .ToDictionary(g => g.Key, g => g.First().DisplayName ?? g.First().ColumnName);

            return (hiddenSet, displayNameMap);
        }

        private async Task<DbConnection> PrepareConnectionAsync()
        {
            var connection = _context.Database.GetDbConnection();
            if (string.IsNullOrEmpty(connection.ConnectionString))
                throw new InvalidOperationException("Connection string is not initialized.");

            if (connection.State != ConnectionState.Open)
                await connection.OpenAsync();

            return connection;
        }

        private async Task ProcessQueriesAsync(
            IList<SQLGenerationModel> generationModels,
            HashSet<(string Table, string Column)> hiddenSet,
            Dictionary<(string Table, string Column), string> displayNameMap,
            GeneralNlpQueryResponseModel response,
            DbConnection connection)
        {
            foreach (var model in generationModels)
            {
                var queryResponse = new NlpQueryResponseModel
                {
                    Sql = model.Sql ?? string.Empty,
                    ModelName = model.Model ?? string.Empty,
                    Results = new List<Dictionary<string, object>>()
                };

                if (!string.IsNullOrWhiteSpace(model.Sql))
                {
                    try
                    {
                        await ProcessSingleQueryAsync(model.Sql, queryResponse, hiddenSet, displayNameMap, connection);
                    }
                    catch (NpgsqlException ex)
                    {
                        queryResponse.IsSyntaxError = true;
                        queryResponse.ErrorMessage = $"Syntax error in SQL query: {ex.Message}";
                    }
                    catch (Exception ex)
                    {
                        queryResponse.ErrorMessage = $"Unexpected error executing SQL query: {ex.Message}";
                    }
                }

                response.SqlQueries.Add(queryResponse);
            }
        }

        private async Task ProcessSingleQueryAsync(
            string sql,
            NlpQueryResponseModel queryResponse,
            HashSet<(string Table, string Column)> hiddenSet,
            Dictionary<(string Table, string Column), string> displayNameMap,
            DbConnection connection)
        {
            using var command = connection.CreateCommand();
            command.CommandText = sql;

            using var reader = await command.ExecuteReaderAsync(CommandBehavior.KeyInfo);
            var columnsInfo = reader.GetColumnSchema()
                .Select((c, index) => new
                {
                    AliasName = c.ColumnName,
                    BaseTableName = c.BaseTableName ?? string.Empty,
                    BaseColumnName = c.BaseColumnName ?? string.Empty,
                    DataType = c.DataType,
                    ColumnOrdinal = index
                })
                .Where(c => !hiddenSet.Contains((c.BaseTableName.ToLowerInvariant(), c.BaseColumnName.ToLowerInvariant())))
                .ToList();

            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();
                foreach (var col in columnsInfo)
                {
                    var key = (col.BaseTableName.ToLowerInvariant(), col.BaseColumnName.ToLowerInvariant());
                    var displayName = "";

                    if (string.IsNullOrEmpty(col.BaseTableName) && string.IsNullOrEmpty(col.BaseColumnName))
                        displayName = col.AliasName.Replace('_', ' ');
                    else if(!string.IsNullOrEmpty(col.AliasName))
                        displayName = col.AliasName;
                    else
                        displayName = displayNameMap.TryGetValue(key, out var dn) && !string.IsNullOrEmpty(dn) ? dn : col.BaseColumnName;
                    
                    var resultKey = $"{displayName}:{col.BaseTableName}.{col.BaseColumnName}";
                    var rawValue = reader.GetValue(col.ColumnOrdinal);
                    var mappedValue = rawValue == DBNull.Value ? null : rawValue;

                    if (col.BaseTableName.ToLowerInvariant() == "freshdesk_ticket")
                    {
                        mappedValue = col.BaseColumnName.ToLowerInvariant() switch
                        {
                            "source" when mappedValue != null => int.TryParse(mappedValue.ToString(), out var intValue)
                                ? FreshdeskCodeMapper.MapSource(intValue)
                                : $"Invalid source value ({mappedValue})",
                            "status" when mappedValue != null => int.TryParse(mappedValue.ToString(), out var intValue)
                                ? FreshdeskCodeMapper.MapStatus(intValue)
                                : $"Invalid status value ({mappedValue})",
                            "priority" when mappedValue != null => int.TryParse(mappedValue.ToString(), out var intValue)
                                ? FreshdeskCodeMapper.MapPriority(intValue)
                                : $"Invalid priority value ({mappedValue})",
                            _ => mappedValue
                        };
                    }

                    row[resultKey] = mappedValue ?? DefaultNameNullRow;
                }
                queryResponse.Results.Add(row);
            }
        }

        public async Task<SqlOperationResultModel> ExecuteSqlAsync(string sql)
        {
            try
            {
                await using var connection = (NpgsqlConnection)_context.Database.GetDbConnection();
                await connection.OpenAsync();

                await using var command = new NpgsqlCommand(sql, connection);
                await command.ExecuteNonQueryAsync();

                return new SqlOperationResultModel
                {
                    IsSuccess = true,
                };
            }
            catch (NpgsqlException ex)
            {
                return new SqlOperationResultModel
                {
                    IsSuccess = false,
                    ErrorMessage = $"SQL execution error: {ex.Message}"
                };
            }
            catch (Exception ex)
            {
                return new SqlOperationResultModel
                {
                    IsSuccess = false,
                    ErrorMessage = $"Unexpected error: {ex.Message}"
                };
            }
        }

    }
}
