using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.Entities;
namespace WorkingOnIt.Data.Repository
{
    public class InterviewQuestionsRepository : RepositoryGeneric<InterviewQuestion>, IInterviewQuestionsRepository
    {
        public InterviewQuestionsRepository(DataContext context) : base(context)
        {
        }
    }
}
