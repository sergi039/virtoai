using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Models;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class ChatRepository : Repository<ChatEntity>, IChatRepository
    {
        public ChatRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ChatEntity>> GetAllWithFullIncludeByUserIdAsync(string userId)
        {
            var result = await _context.Chats
                .Include(c => c.Messages)
                .ThenInclude(m => m.SqlMessages)
                .Include(c => c.ChatUsers)
                .Where(c => c.UserOwnerId == userId || c.ChatUsers.Any(cu => cu.UserId == userId))
                .ToListAsync();

            return result;
        }

        public async Task<ChatEntity?> GetWithAllIncludeByIdAsync(int id)
        {
            var result = await _context.Chats
                .Include(c => c.Messages)
                .ThenInclude(m => m.SqlMessages)
                .Include(c => c.ChatUsers)
                .FirstOrDefaultAsync(c => c.Id == id);

            return result;
        }
    }
}
