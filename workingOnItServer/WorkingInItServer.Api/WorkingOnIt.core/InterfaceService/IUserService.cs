using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingInIt.Api.ModalsDto;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.ModalsDto;
using Microsoft.AspNetCore.Http;
using Recipes.Service.Services;
namespace WorkingOnIt.Core.InterfaceService
{
    public interface IUserService
    {
        public  Task<List<UserDto>> GetAllAsync();

        public  Task<UserDto?> GetByIdAsync(int id);


        public  Task<UserDto> AddAsync(UserDto userDto);
     

        public Task<UserDto> UpdateAsync(int id, UserDto userDto);


        public  Task<bool> DeleteAsync(int id);






        public  Task UpdateResumeAsync(int userId, IFormFile resumeFile);


        public Task<UserDto> UpdateUserAsync(int userId, UserDto updatedUser);




    }
}
