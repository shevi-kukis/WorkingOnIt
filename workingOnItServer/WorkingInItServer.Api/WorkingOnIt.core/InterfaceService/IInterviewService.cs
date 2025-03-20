using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IInterviewService
    {
        Task<List<InterviewDto>> GetAllAsync();
        Task<InterviewDto?> GetByIdAsync(int id);
        Task<InterviewDto> AddAsync(InterviewDto interviewDto);
        Task<InterviewDto> UpdateAsync(int id, InterviewDto interviewDto);
        Task<bool> DeleteAsync(int id);
    }
}

