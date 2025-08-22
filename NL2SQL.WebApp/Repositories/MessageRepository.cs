using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Models;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class MessageRepository : Repository<MessageEntity>, IMessageRepository
    {
        public MessageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<MessageEntity>> GetAllByChatIdAsync(int chatId)
        {
            var result = await _context.Messages
                .Where(m => m.ChatId == chatId)
                .Include(m => m.SqlMessages)
                .ToListAsync();

            return result;
        }
    }
}
