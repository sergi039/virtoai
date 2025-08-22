using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<T> _entities;

        public Repository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _entities = _context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _entities.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _entities.ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _entities.AddAsync(entity);
        }

        public async Task UpdateAsync(T entity)
        {
            _entities.Update(entity);
        }

        public async Task DeleteAsync(T entity)
        {
            _entities.Remove(entity);
        }
    }
}
