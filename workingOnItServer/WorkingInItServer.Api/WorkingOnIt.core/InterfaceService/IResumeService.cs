using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IResumeService
    {
        Task<List<ResumeDto>> GetAllAsync();
        Task<ResumeDto?> GetByIdAsync(int id);
        Task<ResumeDto> AddAsync(ResumeDto resumeDto);
        Task<ResumeDto> UpdateAsync(int id, ResumeDto resumeDto);
        Task<bool> DeleteAsync(int id);
       
        public  Task<ResumeDto?> GetResumeByUserId(int userId);
    }
}
