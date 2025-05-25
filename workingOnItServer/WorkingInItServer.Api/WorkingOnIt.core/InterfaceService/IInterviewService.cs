using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.ModalsDto;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IInterviewService
    {
        Task<List<InterviewDto>> GetAllAsync();
        Task<InterviewDto?> GetByIdAsync(int id);
        Task<InterviewDto> AddAsync(InterviewDto interviewDto);
        Task<InterviewDto> UpdateAsync(int id, InterviewDto interviewDto);
        Task<bool> DeleteAsync(int id);
        public Task<List<Interview>> GetUserInterviewsAsync(int userId);
        public Task<Dictionary<int, List<InterviewScore>>> GetAllUserScoresAsync();

    }
}

