using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IServiceTableRepository : IRepository<ServiceTableEntity>
    {
        Task<IEnumerable<ServiceTableEntity>> GetAllWithServiceTableFieldsAsync();
    }
}
