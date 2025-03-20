using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.Entities
{

    public class Resume
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; } 
        public string FilePath { get; set; } 
        public DateTime UploadDate { get; set; }

        // קשרים
        public int UserId { get; set; }
        public User User { get; set; }

      
    }

}
