
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";

        // קשרים
        public Resume? Resume { get; set; }

        public List<Interview> Interviews { get; set; } = new List<Interview>();
        public int RoleId { get; set; } = 2;
        [ForeignKey("RoleId")]
        public Role Role { get; set; } = null;
    }

    
}
