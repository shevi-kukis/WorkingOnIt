﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;

namespace WorkingOnIt.Core.InterfaceRepository
{
    public interface IResumeRepository:IRepositoryGeneric<Resume>
    {
        public  Task<Resume?> GetByUserIdAsync(int userId);
    }
}
