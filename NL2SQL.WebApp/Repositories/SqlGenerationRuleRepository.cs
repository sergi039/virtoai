using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class SqlGenerationRuleRepository : Repository<SqlGenerationRuleEntity>, ISqlGenerationRuleRepository
    {
        public SqlGenerationRuleRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<SqlGenerationRuleEntity>> GetAllByServiceTableIdAsync(int serviceTableId)
        {
            var result = await _context.SqlGenerationRules
                .Where(rule => rule.ServiceTableId == serviceTableId)
                .ToListAsync();

            return result;
        }
    }
}
