using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.Dtos
{
    public class UserDto
    {


        public int Id { get; set; } = 0;
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";

     
    }
}
