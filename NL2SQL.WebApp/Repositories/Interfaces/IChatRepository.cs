using NL2SQL.WebApp.Models;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IChatRepository : IRepository<ChatEntity>
    {
        Task<IEnumerable<ChatEntity>> GetAllWithFullIncludeByUserIdAsync(string userId);

        Task<ChatEntity?> GetWithAllIncludeByIdAsync(int id);
    }
}
