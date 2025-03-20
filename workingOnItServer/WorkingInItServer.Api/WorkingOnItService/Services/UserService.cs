using AutoMapper;
using Microsoft.AspNetCore.Http;
using Recipes.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingInIt.Api.ModalsDto;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Core.ModalsDto;
using System.IO;
using Microsoft.AspNetCore.Mvc; // וודא שכוללים את המרחב שמכיל את המתודה

namespace WorkingOnIt.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IS3Service _s3Service;

        public UserService(IRepositoryManager repositoryManager, IMapper mapper, JwtService jwtService, IS3Service s3Service)
        {
            _iManager = repositoryManager;
            _mapper = mapper;
            _jwtService = jwtService;
            _s3Service = s3Service;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            List<User> users = await _iManager.userRepository.GetAsync();
            List<UserDto> userDtos = _mapper.Map<List<UserDto>>(users);
            return userDtos;
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            User user = await _iManager.userRepository.GetByIdAsync(id);
            UserDto userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task<UserDto> AddAsync(UserDto userDto)
        {
            User user = _mapper.Map<User>(userDto);
            user = await _iManager.userRepository.AddAsync(user);
            if (user != null)
                await _iManager.SaveAsync();

            userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task<UserDto> UpdateAsync(int id, UserDto userDto)
        {
            User user = _mapper.Map<User>(userDto);
            user = await _iManager.userRepository.UpdateAsync(id, user);
            if (user != null)
                await _iManager.SaveAsync();

            userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager.userRepository.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();

            return flag;
        }

       






        public async Task UpdateResumeAsync(int userId, IFormFile resumeFile)
        {
            // מציאת קובץ קורות החיים הקודם של המשתמש
            var resume = (await _iManager.resumeRepository.GetAsync()).FirstOrDefault(r => r.UserId == userId);

            if (resume == null)
            {
                throw new Exception("Resume not found.");
            }

            // העלאת קובץ חדש ל-S3 והחזרת הנתיב החדש
            var newFilePath = await _s3Service.UpdateFileAsync(resumeFile, resume.FilePath);

            // עדכון הטבלה עם הנתיב החדש
            resume.FilePath = newFilePath;
            await _iManager.resumeRepository.UpdateAsync(resume.Id, resume);
            await _iManager.SaveAsync();
        }

      

        public async Task<UserDto> UpdateUserAsync(int userId, UserDto updatedUser)
        {
            var user = await _iManager.userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            user.FullName = updatedUser.FullName ?? user.FullName;
            user.Email = updatedUser.Email ?? user.Email;

            await _iManager.userRepository.UpdateAsync(user.Id, user);
            await _iManager.SaveAsync();

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email
            };
        }
    }
}
