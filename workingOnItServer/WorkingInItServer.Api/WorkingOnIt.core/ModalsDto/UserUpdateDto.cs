using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.ModalsDto
{
   
        public class UserUpdateDto
        {
            public string? FullName { get; set; }  // שם מלא
            public string? Email { get; set; }     // אימייל
            //public string ?Password { get; set; }  // סיסמה (רק אם המשתמש רוצה לשנות אותה)
        }
    
}
