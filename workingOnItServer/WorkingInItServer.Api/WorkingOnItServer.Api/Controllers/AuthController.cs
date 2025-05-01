using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sprache;
using WorkingInIt.Api.ModalsDto;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Service.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WorkingInIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
  

    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        private readonly IResumeService _resumeService;

        private readonly IMapper _mapper;

        public AuthController(IAuthService service, IMapper mapper, IResumeService resumeService)
        {
            _service = service;
            _mapper = mapper;
            _resumeService = resumeService;
        }
        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
{
    try
    {
        var user = await _service.RegisterUserAsync(dto);
        if (user == null)
            return BadRequest("Email already exists");

        var token = await _service.LoginAsync(new UserLoginDto { Email = dto.Email, Password = dto.Password });

        return Ok(new { token, user });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Register error: {ex.Message}");
        return StatusCode(500, new { message = ex.Message });
    }
}




        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            try
            {
                var token = await _service.LoginAsync(userLoginDto); // קריאה אסינכרונית
                var user = await _service.GetByEmailAsync(userLoginDto.Email); // קריאה אסינכרונית
                var resume = await _resumeService.GetResumeByUserId(user.Id);
                return Ok(new { token, user, resume });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

    }
}
