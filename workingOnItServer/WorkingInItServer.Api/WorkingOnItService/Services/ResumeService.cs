using Amazon.S3.Model;
using AutoMapper;
using Microsoft.AspNetCore.Http;

using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;

namespace WorkingOnIt.Service.Services
{
    public class ResumeService(IRepositoryManager repositoryManager, IMapper mapper,IS3Service s3Service) : IResumeService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;
        private readonly IS3Service _s3Service=s3Service;
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



        public async Task<string> UploadResumeAsync(int userId, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File is empty.");

                var fileUrl = await _s3Service.UploadFileAsync(file);

                Console.WriteLine($"Uploading resume for User ID: {userId}");
                Console.WriteLine($"File URL: {fileUrl}");

                // האם כבר קיים קובץ למשתמש הזה?
                var existingResume = await _iManager.resumeRepository
                    .FindFirstAsync(r => r.UserId == userId);

                if (existingResume != null)
                {
                    // עדכון
                    existingResume.FilePath = fileUrl;
                    existingResume.FileName = file.FileName;
                    existingResume.UploadDate = DateTime.UtcNow;

                    _iManager.resumeRepository.UpdateAsync(existingResume.Id, existingResume);
                }
                else
                {
                    // הוספה
                    var newResume = new Resume
                    {
                        UserId = userId,
                        FilePath = fileUrl,
                        FileName = file.FileName,
                        UploadDate = DateTime.UtcNow
                    };

                    await _iManager.resumeRepository.AddAsync(newResume);
                }

                await _iManager.SaveAsync(); // שמירת השינויים במסד הנתונים

                return fileUrl;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UploadResumeAsync: {ex}");
                throw;
            }
        }


        public async Task<string> UpdateResumeAsync(int userId, IFormFile file)
        {
            var resume = await _iManager.resumeRepository.GetByUserIdAsync(userId);
            if (resume != null)
            {
                await _s3Service.DeleteFileAsync(resume.FilePath);
                _iManager.resumeRepository.DeleteAsync(resume.Id);
            }

            return await UploadResumeAsync(userId, file);
        }

        public async Task<string?> GetDownloadUrlAsync(int userId)
        {
            var resume = await _iManager.resumeRepository.GetByUserIdAsync(userId);
            return resume != null ? await _s3Service.GeneratePresignedDownloadUrlAsync(resume.FilePath) : null;
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
