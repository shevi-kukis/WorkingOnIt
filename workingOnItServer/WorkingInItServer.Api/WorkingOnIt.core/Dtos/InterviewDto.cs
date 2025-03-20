using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.Dtos
{
    public class InterviewDto
    {
        public int Id { get; set; }
        public DateTime InterviewDate { get; set; }

        // קשרים
        public int UserId { get; set; }

        //public int ResumeId { get; set; }
        //public Resume Resume { get; set; }

   
        public int? Score { get; set; } // ציון אופציונלי
    }
}
