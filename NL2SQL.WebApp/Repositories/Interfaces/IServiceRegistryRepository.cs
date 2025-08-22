using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IServiceRegistryRepository : IRepository<ServiceRegistryEntity>
    {
        Task<List<ServiceRegistryEntity>> GetAllWithIncludeAllAsync();

        Task<List<ServiceTableEntity>> GetServiceTablesByServiceRegistryIdAsync(int registryId);
    }
}
