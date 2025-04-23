using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

﻿using System;
using System.Collections.Generic;

using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.Entities
{
    public class Permission
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string NamePermission { get; set; }
        public string Description { get; set; }
    }
}