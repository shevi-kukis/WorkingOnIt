using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;

namespace WorkingOnIt.Service.Services
{
    public class InterviewQuestionsService(IRepositoryManager repositoryManager, IMapper mapper) : IInterviewQuestionsService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<List<InterviewQuestionsDto>> GetAllAsync()
        {
            List<InterviewQuestion> interviewQuestions = await _iManager.interviewQuestionsRepository.GetAsync();
            List<InterviewQuestionsDto> interviewQuestionDtos = _mapper.Map<List<InterviewQuestionsDto>>(interviewQuestions);
            return interviewQuestionDtos;
        }

        public async Task<InterviewQuestionsDto?> GetByIdAsync(int id)
        {
            InterviewQuestion interviewQuestion = await _iManager.interviewQuestionsRepository.GetByIdAsync(id);
            InterviewQuestionsDto interviewQuestionDto = _mapper.Map<InterviewQuestionsDto>(interviewQuestion);
            return interviewQuestionDto;
        }

        public async Task<InterviewQuestionsDto> AddAsync(InterviewQuestionsDto interviewQuestionDto)
        {
            InterviewQuestion interviewQuestion = _mapper.Map<InterviewQuestion>(interviewQuestionDto);
            interviewQuestion = await _iManager.interviewQuestionsRepository.AddAsync(interviewQuestion);
            if (interviewQuestion != null)
                await _iManager.SaveAsync();
            interviewQuestionDto = _mapper.Map<InterviewQuestionsDto>(interviewQuestion);
            return interviewQuestionDto;
        }

        public async Task<InterviewQuestionsDto> UpdateAsync(int id, InterviewQuestionsDto interviewQuestionDto)
        {
            InterviewQuestion interviewQuestion = _mapper.Map<InterviewQuestion>(interviewQuestionDto);
            interviewQuestion = await _iManager.interviewQuestionsRepository.UpdateAsync(id, interviewQuestion);
            if (interviewQuestion != null)
                await _iManager.SaveAsync();
            interviewQuestionDto = _mapper.Map<InterviewQuestionsDto>(interviewQuestion);
            return interviewQuestionDto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager.interviewQuestionsRepository.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
    }
}
