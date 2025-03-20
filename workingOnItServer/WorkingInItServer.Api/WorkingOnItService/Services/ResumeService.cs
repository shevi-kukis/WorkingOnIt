using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;

namespace WorkingOnIt.Service.Services
{
    public class ResumeService(IRepositoryManager repositoryManager, IMapper mapper) : IResumeService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ResumeDto>> GetAllAsync()
        {
            List<Resume> resumes = await _iManager.resumeRepository.GetAsync();
            return _mapper.Map<List<ResumeDto>>(resumes);
        }

        public async Task<ResumeDto?> GetByIdAsync(int id)
        {
            Resume resume = await _iManager.resumeRepository.GetByIdAsync(id);
            return _mapper.Map<ResumeDto>(resume);
        }

        public async Task<ResumeDto> AddAsync(ResumeDto resumeDto)
        {
            Resume resume = _mapper.Map<Resume>(resumeDto);
            resume = await _iManager.resumeRepository.AddAsync(resume);
            if (resume != null)
                await _iManager.SaveAsync();
            return _mapper.Map<ResumeDto>(resume);
        }

        public async Task<ResumeDto> UpdateAsync(int id, ResumeDto resumeDto)
        {
            Resume resume = _mapper.Map<Resume>(resumeDto);
            resume = await _iManager.resumeRepository.UpdateAsync(id, resume);
            if (resume != null)
                await _iManager.SaveAsync();
            return _mapper.Map<ResumeDto>(resume);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager.resumeRepository.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
        public async Task<ResumeDto?> GetResumeByUserId(int userId)
        {
            var resume = await _iManager.resumeRepository.GetByUserIdAsync(userId);
            return resume != null ? _mapper.Map<ResumeDto>(resume) : null;
        }


    }



}
