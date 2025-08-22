using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class ServiceTableFieldRepository : Repository<ServiceTableFieldEntity>, IServiceTableFieldRepository
    {
        public ServiceTableFieldRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IList<ServiceTableFieldEntity>> GetAllWithContextMenuAsync()
        {
            var result = await _context.TableFields
                .Include(tf => tf.ContextMenuItems)
                .ToListAsync();

            return result;
        }

        public async Task<ServiceTableFieldEntity?> GetByIdWithContextMenuAsync(int id)
        {
            var result = await _context.TableFields
                .Include(tf => tf.ContextMenuItems)
                .FirstOrDefaultAsync(tf => tf.Id == id);

            return result;
        }
    }
}
