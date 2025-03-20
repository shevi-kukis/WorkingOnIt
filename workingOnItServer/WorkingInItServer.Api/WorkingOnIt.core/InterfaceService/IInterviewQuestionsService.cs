using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IInterviewQuestionsService
    {
        Task<List<InterviewQuestionsDto>> GetAllAsync();
        Task<InterviewQuestionsDto?> GetByIdAsync(int id);
        Task<InterviewQuestionsDto> AddAsync(InterviewQuestionsDto interviewQuestionDto);
        Task<InterviewQuestionsDto> UpdateAsync(int id, InterviewQuestionsDto interviewQuestionDto);
        Task<bool> DeleteAsync(int id);
    }
}
