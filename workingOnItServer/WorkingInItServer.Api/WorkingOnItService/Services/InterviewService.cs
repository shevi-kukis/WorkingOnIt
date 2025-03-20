using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;

namespace WorkingOnIt.Service.Services
{
    public class InterviewService(IRepositoryManager repositoryManager, IMapper mapper) : IInterviewService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<List<InterviewDto>> GetAllAsync()
        {
            var interviews = await _iManager.interviewRepository.GetAsync();
            return _mapper.Map<List<InterviewDto>>(interviews);
        }

        public async Task<InterviewDto?> GetByIdAsync(int id)
        {
            var interview = await _iManager.interviewRepository.GetByIdAsync(id);
            return interview != null ? _mapper.Map<InterviewDto>(interview) : null;
        }

        public async Task<InterviewDto> AddAsync(InterviewDto interviewDto)
        {
            var interview = _mapper.Map<Interview>(interviewDto);
            var addedInterview = await _iManager.interviewRepository.AddAsync(interview);
            await _iManager.SaveAsync();
            return _mapper.Map<InterviewDto>(addedInterview);
        }

        public async Task<InterviewDto> UpdateAsync(int id, InterviewDto interviewDto)
        {
            var interview = _mapper.Map<Interview>(interviewDto);
            var updatedInterview = await _iManager.interviewRepository.UpdateAsync(id, interview);
            await _iManager.SaveAsync();
            return _mapper.Map<InterviewDto>(updatedInterview);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var isDeleted = await _iManager.interviewRepository.DeleteAsync(id);
            if (isDeleted)
                await _iManager.SaveAsync();
            return isDeleted;
        }
    }
}
