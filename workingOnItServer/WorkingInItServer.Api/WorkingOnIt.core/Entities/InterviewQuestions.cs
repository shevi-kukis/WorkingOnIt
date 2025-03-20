using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.Entities
{
    public class InterviewQuestion
    {
        [Key]
        public int Id { get; set; }
        public string Question { get; set; } 
        public string UserAnswer { get; set; } 
        public string AiFeedback { get; set; }

        // קשרים
        public int InterviewId { get; set; }
        public Interview Interview { get; set; }
    }

}
