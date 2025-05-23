using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.InterfaceRepository
{
    public interface IResumeRepository:IRepositoryGeneric<Resume>
    {
        public  Task<Resume?> GetByUserIdAsync(int userId);
        Task<Resume?> FindFirstAsync(Expression<Func<Resume, bool>> predicate);

    }
}
