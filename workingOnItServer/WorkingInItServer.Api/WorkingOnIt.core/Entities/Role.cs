using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace WorkingOnIt.Core.Entities
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string NameRole { get; set; } = "User";

        public List<User> Users { get; set; }

        public List<Permission> Permissions { get; set; }

        public static implicit operator int(Role v)
        {
            return v.Id;
        }

    }
}