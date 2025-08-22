using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IServiceTableFieldRepository : IRepository<ServiceTableFieldEntity>
    {
        Task<IList<ServiceTableFieldEntity>> GetAllWithContextMenuAsync();

        Task<ServiceTableFieldEntity?> GetByIdWithContextMenuAsync(int id);
    }
}
