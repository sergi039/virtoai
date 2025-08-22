using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities.Enums;
using NL2SQL.WebApp.Extensions;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Models.Database.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using Npgsql;
using System.Text;

namespace NL2SQL.WebApp.Repositories
{
    public class DatabaseMetadataRepository : IDatabaseMetadataRepository
    {
        private readonly AppDbContext _context;
        private const string NameSetting = "setting";

        public DatabaseMetadataRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<string> GetAvailableTablesServiceAsString()
        {
            var apolloSetting = await _context.ApolloSettings.FirstOrDefaultAsync();
            var freshdeskSetting = await _context.FreshdeskSettings.FirstOrDefaultAsync();
            var orttoSetting = await _context.OrttoSettings.FirstOrDefaultAsync();
            var pipedriveSetting = await _context.PipedriveSettings.FirstOrDefaultAsync();

            var sb = new StringBuilder();

            var model = _context.Model;
            var entityTypes = model.GetEntityTypes();

            foreach (var entityType in entityTypes)
            {
                var tableName = entityType.GetTableName();
                if (tableName == null)
                    continue;

                if (!tableName.Contains("Apollo", StringComparison.OrdinalIgnoreCase))
                    continue;

                var isTableSelected = false;

                if (tableName.Contains(DatabaseServiceName.Pipedrive.GetDescription())
                    && pipedriveSetting != null
                    && pipedriveSetting.IsActive
                    && pipedriveSetting?.Tables?.Split(',').Contains(tableName) == true)
                {
                    isTableSelected = true;
                }
                else if (tableName.Contains(DatabaseServiceName.Ortto.GetDescription())
                    && orttoSetting != null
                    && orttoSetting.IsActive
                    && orttoSetting?.Tables?.Split(',').Contains(tableName) == true)
                {
                    isTableSelected = true;
                }
                else if (tableName.Contains(DatabaseServiceName.Freshdesk.GetDescription())
                    && freshdeskSetting != null
                    && freshdeskSetting.IsActive
                    && freshdeskSetting?.Tables?.Split(',').Contains(tableName) == true)
                {
                    isTableSelected = true;
                }
                else if (tableName.Contains(DatabaseServiceName.Apollo.GetDescription())
                    && apolloSetting != null
                    && apolloSetting.IsActive
                    && apolloSetting?.Tables?.Split(',').Contains(tableName) == true)
                {
                    isTableSelected = true;
                }

                if (!isTableSelected || tableName.Contains(NameSetting))
                    continue;

                sb.AppendLine($"Table: {tableName}");

                var properties = entityType.GetProperties();

                foreach (var property in properties)
                {
                    sb.AppendLine($"  Column: {property.GetColumnName()}");
                    sb.AppendLine($"    Type: {property.GetColumnType()}");
                    sb.AppendLine($"    IsNullable: {property.IsNullable}");
                    sb.AppendLine($"    IsPrimaryKey: {property.IsPrimaryKey()}");
                    sb.AppendLine($"    IsForeignKey: {property.IsForeignKey()}");
                    sb.AppendLine();
                }

                sb.AppendLine();
            }

            return sb.ToString();
        }

        public async Task<DatabaseSchemaModel> GetDatabaseSchemaAsync()
        {
            var databaseSchema = InitializeSchema();

            try
            {
                await using var connection = (NpgsqlConnection)_context.Database.GetDbConnection();
                await connection.OpenAsync();

                var tablesData = await FetchTablesDataAsync(connection);
                foreach (var (tableName, description, createdAt) in tablesData)
                {
                    var fields = await FetchColumnsDataAsync(connection, tableName);
                    databaseSchema.Tables.Add(new TableSchemaModel
                    {
                        Id = $"{tableName}_{Guid.NewGuid():N}",
                        Name = tableName,
                        Description = description,
                        Fields = fields,
                        CreatedAt = createdAt,
                        UpdatedAt = createdAt,
                        ForeignKeys = new List<ForeignKeyModel>()
                    });
                }

                await PopulateForeignKeysAsync(connection, databaseSchema);
            }
            catch (NpgsqlException ex)
            {
                Console.WriteLine($"Error fetching database schema: {ex.Message}");
                throw new InvalidOperationException($"Failed to retrieve database schema: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                throw;
            }

            return databaseSchema;
        }


        private DatabaseSchemaModel InitializeSchema()
        {
            return new DatabaseSchemaModel
            {
                DatabaseName = _context.Database.GetDbConnection().Database ?? "Unknown",
                Tables = new List<TableSchemaModel>(),
                LastUpdated = DateTime.UtcNow
            };
        }

        private async Task<List<(string name, string description, DateTime createdAt)>> FetchTablesDataAsync(NpgsqlConnection connection)
        {
            const string tablesSql = @"
                SELECT 
                    t.table_name,
                    obj_description(c.oid) as table_comment,
                    NOW() as created_at
                FROM information_schema.tables t
                LEFT JOIN pg_class c ON c.relname = t.table_name
                LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE t.table_schema = 'public'
                AND t.table_type = 'BASE TABLE'
                AND n.nspname = 'public'
                ORDER BY t.table_name
            ";

            var tablesData = new List<(string name, string description, DateTime createdAt)>();
            await using var command = new NpgsqlCommand(tablesSql, connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var tableName = reader.GetString(0);
                var description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
                var createdAt = reader.GetDateTime(2);
                tablesData.Add((tableName, description, createdAt));
            }

            return tablesData;
        }

        private async Task<List<TableFieldModel>> FetchColumnsDataAsync(NpgsqlConnection connection, string tableName)
        {
            const string columnsSql = @"
                SELECT 
                    c.column_name,
                    c.data_type,
                    c.character_maximum_length,
                    c.numeric_precision,
                    c.numeric_scale,
                    c.is_nullable,
                    c.column_default,
                    (SELECT EXISTS (
                        SELECT 1
                        FROM information_schema.table_constraints tc
                        JOIN information_schema.constraint_column_usage ccu
                            ON tc.constraint_name = ccu.constraint_name
                        WHERE tc.constraint_type = 'PRIMARY KEY'
                        AND tc.table_name = c.table_name
                        AND ccu.column_name = c.column_name
                        AND tc.table_schema = 'public'
                    )) AS is_primary_key,
                    (SELECT EXISTS (
                        SELECT 1
                        FROM information_schema.table_constraints tc
                        JOIN information_schema.constraint_column_usage ccu
                            ON tc.constraint_name = ccu.constraint_name
                        WHERE tc.constraint_type = 'UNIQUE'
                        AND tc.table_name = c.table_name
                        AND ccu.column_name = c.column_name
                        AND tc.table_schema = 'public'
                    )) AS is_unique,
                    col_description(pgc.oid, c.ordinal_position) as column_comment,
                    c.ordinal_position
                FROM information_schema.columns c
                LEFT JOIN pg_class pgc ON pgc.relname = c.table_name
                LEFT JOIN pg_namespace pgn ON pgn.oid = pgc.relnamespace
                WHERE c.table_schema = 'public'
                AND c.table_name = @tableName
                AND pgn.nspname = 'public'
                ORDER BY c.ordinal_position
            ";

            var fields = new List<TableFieldModel>();
            await using var command = new NpgsqlCommand(columnsSql, connection);
            command.Parameters.AddWithValue("tableName", tableName);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                fields.Add(CreateTableFieldModel(tableName, reader));
            }

            return fields;
        }

        
        private TableFieldModel CreateTableFieldModel(string tableName, NpgsqlDataReader reader)
        {
            var columnName = reader.GetString(0);
            var dataType = reader.GetString(1);
            var maxLength = reader.IsDBNull(2) ? (int?)null : reader.GetInt32(2);
            var precision = reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3);
            var scale = reader.IsDBNull(4) ? (int?)null : reader.GetInt32(4);
            var isNullable = reader.GetString(5) == "YES";
            var defaultValue = reader.IsDBNull(6) ? null : reader.GetString(6);
            var isPrimaryKey = reader.GetBoolean(7);
            var isUnique = reader.GetBoolean(8);
            var columnComment = reader.IsDBNull(9) ? string.Empty : reader.GetString(9);

            var frontendType = MapPostgreSqlTypeToFrontend(dataType);

            return new TableFieldModel
            {
                Id = $"{tableName}_{columnName}_{Guid.NewGuid():N}",
                Name = columnName,
                Type = frontendType,
                IsRequired = !isNullable,
                IsPrimaryKey = isPrimaryKey,
                IsUnique = isUnique || isPrimaryKey,
                DefaultValue = defaultValue,
                MaxLength = maxLength,
                Precision = precision,
                Scale = scale,
                Description = columnComment
            };
        }

        private async Task PopulateForeignKeysAsync(NpgsqlConnection connection, DatabaseSchemaModel databaseSchema)
        {
            const string foreignKeysSql = @"
                SELECT 
                    tc.table_name AS source_table,
                    tc.constraint_name,
                    kcu.column_name AS source_column,
                    ccu.table_name AS target_table,
                    ccu.column_name AS target_column
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_table_usage ctu
                    ON tc.constraint_name = ctu.constraint_name
                JOIN information_schema.referential_constraints rc
                    ON tc.constraint_name = rc.constraint_name
                JOIN information_schema.key_column_usage ccu
                    ON rc.unique_constraint_name = ccu.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'
                ORDER BY tc.table_name, tc.constraint_name
            ";

            await using var command = new NpgsqlCommand(foreignKeysSql, connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var sourceTable = reader.GetString(0);
                var constraintName = reader.GetString(1);
                var sourceColumn = reader.GetString(2);
                var targetTable = reader.GetString(3);
                var targetColumn = reader.GetString(4);

                var table = databaseSchema.Tables.FirstOrDefault(t => t.Name == sourceTable);
                if (table != null)
                {
                    table.ForeignKeys.Add(new ForeignKeyModel
                    {
                        ConstraintName = constraintName,
                        SourceTable = sourceTable,
                        SourceColumn = sourceColumn,
                        TargetTable = targetTable,
                        TargetColumn = targetColumn
                    });
                }
            }
        }

        private async Task PopulateForeignKeysAsync(NpgsqlConnection connection, TableSchemaModel tableSchema)
        {
            const string foreignKeysSql = @"
                SELECT 
                    tc.table_name AS source_table,
                    tc.constraint_name,
                    kcu.column_name AS source_column,
                    ccu.table_name AS target_table,
                    ccu.column_name AS target_column
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_table_usage ctu
                    ON tc.constraint_name = ctu.constraint_name
                JOIN information_schema.referential_constraints rc
                    ON tc.constraint_name = rc.constraint_name
                JOIN information_schema.key_column_usage ccu
                    ON rc.unique_constraint_name = ccu.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'
                ORDER BY tc.table_name, tc.constraint_name
            ";

            await using var command = new NpgsqlCommand(foreignKeysSql, connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var sourceTable = reader.GetString(0);
                var constraintName = reader.GetString(1);
                var sourceColumn = reader.GetString(2);
                var targetTable = reader.GetString(3);
                var targetColumn = reader.GetString(4);

                var table = tableSchema.Name == sourceTable ? tableSchema : null;

                if (table != null)
                {
                    table.ForeignKeys.Add(new ForeignKeyModel
                    {
                        ConstraintName = constraintName,
                        SourceTable = sourceTable,
                        SourceColumn = sourceColumn,
                        TargetTable = targetTable,
                        TargetColumn = targetColumn
                    });
                }
            }
        }

        private static string MapPostgreSqlTypeToFrontend(string pgType)
        {
            return pgType.ToLower() switch
            {
                "character varying" or "varchar" => "varchar",
                "text" => "text",
                "character" or "char" => "char",
                "smallint" or "int2" => "smallint",
                "integer" or "int4" => "integer",
                "bigint" or "int8" => "bigint",
                "decimal" => "decimal",
                "numeric" => "numeric",
                "real" or "float4" => "real",
                "double precision" or "float8" => "double precision",
                "boolean" or "bool" => "boolean",
                "date" => "date",
                "time without time zone" or "time" => "time",
                "timestamp without time zone" or "timestamp" => "timestamp",
                "timestamp with time zone" or "timestamptz" => "timestamptz",
                "json" => "json",
                "jsonb" => "jsonb",
                "uuid" => "uuid",
                "bytea" => "bytea",
                "serial" or "serial4" => "serial",
                "bigserial" or "serial8" => "bigserial",
                _ => pgType.ToLower()
            };
        }

        public IList<string> GetDatabaseTablesService()
        {
            var result = new List<string>();

            var model = _context.Model;
            var entityTypes = model.GetEntityTypes();

            foreach (var entityType in entityTypes)
            {
                if (entityType.GetTableName() != null
                    && entityType.GetTableName().Contains(DatabaseServiceName.Pipedrive.GetDescription().ToLower())
                    || entityType.GetTableName().Contains(DatabaseServiceName.Ortto.GetDescription().ToLower())
                    || entityType.GetTableName().Contains(DatabaseServiceName.Freshdesk.GetDescription().ToLower())
                    || entityType.GetTableName().Contains(DatabaseServiceName.Apollo.GetDescription().ToLower())
                   )
                {
                    if (entityType.GetTableName().Contains(NameSetting))
                        continue;

                    result.Add(entityType.GetTableName());
                }
            }

            return result;
        }

        public async Task<TableSchemaModel> GetTableSchemaAsync(string searchTableName)
        {
            var tableSchema = new TableSchemaModel();

            try
            {
                await using var connection = (NpgsqlConnection)_context.Database.GetDbConnection();
                await connection.OpenAsync();

                var tablesData = await FetchTablesDataAsync(connection);
                foreach (var (tableName, description, createdAt) in tablesData)
                {
                    if (tableName != searchTableName) continue;

                    var fields = await FetchColumnsDataAsync(connection, tableName);

                    tableSchema.Id = $"{tableName}_{Guid.NewGuid():N}";
                    tableSchema.Name = tableName;
                    tableSchema.Description = description;
                    tableSchema.Fields = fields;
                    tableSchema.CreatedAt = createdAt;
                    tableSchema.UpdatedAt = createdAt;
                    tableSchema.ForeignKeys = new List<ForeignKeyModel>();

                    break;
                }

                await PopulateForeignKeysAsync(connection, tableSchema);
            }
            catch (NpgsqlException ex)
            {
                Console.WriteLine($"Error fetching database schema: {ex.Message}");
                throw new InvalidOperationException($"Failed to retrieve database schema: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                throw;
            }

            return tableSchema;
        }
    }
}
