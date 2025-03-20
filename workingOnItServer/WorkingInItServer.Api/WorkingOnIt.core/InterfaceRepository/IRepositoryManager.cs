using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.InterfaceRepository
{
    public interface IRepositoryManager
    {
         

        IUserRepository userRepository { get; }
       IResumeRepository resumeRepository { get; }

        IInterviewQuestionsRepository interviewQuestionsRepository { get; }
        IInterviewRepository interviewRepository { get; }

        public Task SaveAsync();

    }
}

