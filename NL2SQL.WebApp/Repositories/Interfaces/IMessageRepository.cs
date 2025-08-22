using NL2SQL.WebApp.Models;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface IMessageRepository : IRepository<MessageEntity>
    {
        Task<IEnumerable<MessageEntity>> GetAllByChatIdAsync(int chatId);
    }
}
