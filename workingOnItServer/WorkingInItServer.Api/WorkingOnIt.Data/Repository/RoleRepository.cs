using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;

namespace WorkingOnIt.Data.Repository
{
    public class RoleRepository : RepositoryGeneric<Role>, IRoleRepository
    {
        public RoleRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<List<Role>> GetFull()
        {
            return await _dbSet.Include(r => r.Permissions).ToListAsync();
        }

        public async Task<Role> GetRoleByName(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.NameRole == name);
        }
    }
}
