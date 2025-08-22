using NL2SQL.WebApp.Models.Database.Response;
using NL2SQL.WebApp.Models.Message.Response;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IChatRepository Chats { get; }
        IMessageRepository Messages { get; }
        IOrttoRepository Ortto { get; }
        IPipedriveRepository Pipedrive { get; }
        IFreshdeskRepository Freshdesk { get; }    
        IApolloRepository Apollo { get; }         
        ISettingDataRepository Settings { get; }    
        ISqlTrainingDataRepository SqlTrainingData { get; } 
        ISqlMessageRepository SqlMessages { get; }
        ISqlGenerationRuleRepository SqlGenerationRules { get; }
        IServiceRegistryRepository ServiceRegistries { get; }
        IServiceTableFieldRepository ServiceTableFields { get; }
        IServiceTableRepository ServiceTables { get; }
        IChatUserRepository ChatUsers { get; }
        IServiceTableImplicitRelationRepository ImplicitRelations { get; }
        IContextMenuItemRepository ContextMenuItems { get; }
        IDatabaseMetadataRepository DatabaseMetadata { get; }
        Task<int> CompleteAsync();
        Task<SqlOperationResultModel> ExecuteSqlAsync(string sql);
        Task<GeneralNlpQueryResponseModel> ExecuteAIGeneratedSqlAsync(IList<SQLGenerationModel> generationModels);
    }
}
