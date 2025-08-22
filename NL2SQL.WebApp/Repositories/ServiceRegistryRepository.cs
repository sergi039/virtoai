using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class ServiceRegistryRepository : Repository<ServiceRegistryEntity>, IServiceRegistryRepository
    {
        public ServiceRegistryRepository(AppDbContext context) : base(context)
        {
        }

        public Task<List<ServiceRegistryEntity>> GetAllWithIncludeAllAsync()
        {
            var result = _context.ServiceRegistries
                .Include(sr => sr.ServiceTables)
                .ThenInclude(st => st.TableFields)
                .Include(sr => sr.ServiceTables)
                .ThenInclude(st => st.ImplicitRelationsAsPrimary)
                .ToListAsync();

            return result;
        }

        public async Task<List<ServiceTableEntity>> GetServiceTablesByServiceRegistryIdAsync(int registryId)
        {
            var result = await _context.ServiceTables
                .Where(st => st.ServiceRegistryEntityId == registryId)
                .ToListAsync();

            return result;
        }
    }
}
