using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class SqlMessageRepository : Repository<SqlMessageEntity>, ISqlMessageRepository
    {
        public SqlMessageRepository(AppDbContext context) : base(context)
        {
        }
    }
}
