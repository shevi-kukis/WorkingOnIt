using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.InterfaceRepository
{
    public interface IUserRepository:IRepositoryGeneric<User>
    {
        public Task<IEnumerable<User>> GetAsyncFull(params Expression<Func<User, object>>[] includes);

        public Task<User?> GetByIdWithRoleAsync(int id);
    }
}
