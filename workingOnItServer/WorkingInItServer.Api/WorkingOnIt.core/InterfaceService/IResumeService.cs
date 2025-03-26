using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using Microsoft.AspNetCore.Http;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IResumeService
    {
        Task<List<ResumeDto>> GetAllAsync();
        Task<ResumeDto?> GetByIdAsync(int id);
        Task<ResumeDto> AddAsync(ResumeDto resumeDto);
    
        Task<bool> DeleteAsync(int id);
       
        public  Task<ResumeDto?> GetResumeByUserId(int userId);
        Task<string> UploadResumeAsync(int userId, IFormFile file);
        Task<string> UpdateResumeAsync(int userId, IFormFile file);
        Task<string?> GetDownloadUrlAsync(int userId);
    }
}
