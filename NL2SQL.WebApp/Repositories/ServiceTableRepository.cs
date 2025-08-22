using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class ServiceTableRepository : Repository<ServiceTableEntity>, IServiceTableRepository
    {
        public ServiceTableRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ServiceTableEntity>> GetAllWithServiceTableFieldsAsync()
        {
            var result = await _context.ServiceTables
                .Include(st => st.TableFields)
                .Include(st => st.ImplicitRelationsAsPrimary)
                .ToListAsync();

            return result;
        }
    }
}
