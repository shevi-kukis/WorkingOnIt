using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.Entities
{
    public class Manager
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; } 
        public string PasswordHash { get; set; } 

        //public List<User> Users { get; set; }
    }
}
