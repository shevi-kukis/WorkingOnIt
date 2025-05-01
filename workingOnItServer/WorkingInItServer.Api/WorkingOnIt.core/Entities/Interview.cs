using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.Entities
{
    public class Interview
    {
        [Key]
        public int Id { get; set; }
        public DateTime InterviewDate { get; set; } = DateTime.UtcNow;

        // קשרים
        public int UserId { get; set; }
        public User User { get; set; }

        //public int ResumeId { get; set; }
        //public Resume Resume { get; set; }

        //public List<InterviewQuestion> Questions { get; set; } 
        public int  Score { get; set; } // ציון אופציונלי
    }

}
