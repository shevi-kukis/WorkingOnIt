using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkingInIt.Api.ModalsDto;
using WorkingOnIt.Core.InterfaceService;

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
        public async Task<IActionResult> Register([FromForm] UserRegisterDto model)
        {
            try
            {
                Console.WriteLine($"FullName: {model.FullName}");
                Console.WriteLine($"Email: {model.Email}");
                Console.WriteLine($"PasswordHash: {model.PasswordHash}");
                Console.WriteLine($"ResumeFile: {model.Resume.FileName}");

                await _service.RegisterUserAsync(model); // קריאה אסינכרונית

                var userLoginDto = new UserLoginDto
                {
                    Email = model.Email,
                    Password = model.PasswordHash
                };

                // קריאה ישירה לשירות ההתחברות במקום לקרוא לפונקציה Login
                var token = await _service.LoginAsync(userLoginDto);
                var user = await _service.GetByEmailAsync(userLoginDto.Email);
                var resume = await _resumeService.GetResumeByUserId(user.Id);

                return Ok(new { token, user, resume });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error registering user.", details = ex.Message });
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
