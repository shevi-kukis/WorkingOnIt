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
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public AuthController(IAuthService service, IMapper mapper, IResumeService resumeService, IEmailService emailService)
        {
            _service = service;
            _mapper = mapper;
            _resumeService = resumeService;
            _emailService = emailService;
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
                //var subject = "ברוכים הבאים למערכת הכנה לראיונות עבודה";
                //var body = $"שלום {user.FullName} אנחנו שמחים בהצטרפותך לאתר שלנו";
                //_emailService.SendEmailAsync(user.Email, subject, body);
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
                Console.WriteLine("aaaaaaaa");
                var token = await _service.LoginAsync(userLoginDto); // קריאה אסינכרונית
                var user = await _service.GetByEmailAsync(userLoginDto.Email); // קריאה אסינכרונית
                var resume = await _resumeService.GetResumeByUserId(user.Id);
                Console.WriteLine("token:"+token);
                return Ok(new { token, user, resume });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

    }
}
