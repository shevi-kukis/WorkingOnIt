using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.InterfaceRepository
{
    public interface IInterviewRepository:IRepositoryGeneric<Interview>
    {
        public  Task<List<Interview>> GetByUserIdAsync(int userId);
    }
}
