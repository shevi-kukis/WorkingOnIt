using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;

namespace WorkingOnIt.Data.Repository
{
    public class UserRepository : RepositoryGeneric<User>, IUserRepository
    {
        public UserRepository(DataContext context) : base(context)
        {
        }
        public async Task<IEnumerable<User>> GetAsyncFull(params Expression<Func<User, object>>[] includes)
        {
            IQueryable<User> query = _dbSet;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.ToListAsync();
        }
        public async Task<User?> GetByIdWithRoleAsync(int id)
        {
            return await _dbSet
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }


    }
}
