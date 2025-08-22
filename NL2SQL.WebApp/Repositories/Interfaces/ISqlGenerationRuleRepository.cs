using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface ISqlGenerationRuleRepository : IRepository<SqlGenerationRuleEntity>
    {
        Task<IEnumerable<SqlGenerationRuleEntity>> GetAllByServiceTableIdAsync(int serviceTableId);
    }
}
