using AutoMapper;
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

namespace WorkingOnIt.Service.Services
{
    public class AuthService:IAuthService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        private readonly JwtService _jwtService;
        private readonly IS3Service _s3Service;

        public AuthService(IRepositoryManager repositoryManager, IMapper mapper, JwtService jwtService, IS3Service s3Service)
        {
            _iManager = repositoryManager;
            _mapper = mapper;
            _jwtService = jwtService;
            _s3Service = s3Service;
        }
        public async Task<UserDto> GetByEmailAsync(string email)
        {
            var user = (await _iManager.userRepository.GetAsync()).FirstOrDefault(u => u.Email == email);
            if (user == null)
                throw new Exception("User not found");

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PasswordHash = user.PasswordHash
            };
        }

        public async Task<string> LoginAsync(UserLoginDto userLoginDto)
        {
            var user = (await _iManager.userRepository.GetAsync()).FirstOrDefault(u => u.Email == userLoginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))

                throw new Exception("Invalid email or password");

            return _jwtService.GenerateToken(user);
        }

        public async Task<User?> RegisterUserAsync(UserRegisterDto model)

        {
            var user = (await _iManager.userRepository.GetAsync()).FirstOrDefault(u => u.Email == model.Email);
            if (user != null)
                throw new Exception("User already exist");
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

             user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = hashedPassword
            };

            _iManager.userRepository.AddAsync(user);
            await _iManager.SaveAsync();

            return user;
        }

    }
}
