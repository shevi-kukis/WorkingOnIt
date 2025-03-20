using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.Dtos
{
    public class InterviewQuestionsDto
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string UserAnswer { get; set; }
        public string AiFeedback { get; set; }

        // קשרים
        public int InterviewId { get; set; }
        

    }
}
