using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class ChatUserRepository : Repository<ChatUserEntity>, IChatUserRepository
    {
        public ChatUserRepository(AppDbContext context) : base(context)
        {
        }
    }
}
