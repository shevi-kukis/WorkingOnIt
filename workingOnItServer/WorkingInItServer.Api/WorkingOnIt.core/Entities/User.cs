using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.Entities
{
   
        public class User
        {
        [Key]
        public int Id { get; set; } = 0;
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";

        // קשרים
        public Resume? Resume { get; set; }

        public List<Interview> Interviews { get; set; }
        }

    
}
