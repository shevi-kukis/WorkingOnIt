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
    public class InterviewRepository : RepositoryGeneric<Interview>, IInterviewRepository
    {
        public InterviewRepository(DataContext context) : base(context)
        {

        }
        public async Task<List<Interview>> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(i => i.UserId == userId)
                .OrderBy(i => i.InterviewDate)
                .ToListAsync();
        }


    }
}
