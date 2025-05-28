using Microsoft.AspNetCore.Mvc;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.InterfaceService;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.ModalsDto;
using WorkingOnIt.Service.Services;

namespace WorkingOnIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController(IInterviewService service, IEmailService emailService,IUserService userService) : ControllerBase
    {
        private readonly IInterviewService _service = service;
    private readonly IEmailService _emailService= emailService;
        private readonly IUserService _userService = userService;


        // GET: api/Interview
        [HttpGet]
        public async Task<ActionResult<List<InterviewDto>>> Get()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // GET api/Interview/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InterviewDto>> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        // POST api/Interview
        [HttpPost]
        public async Task<ActionResult<InterviewDto>> Post([FromBody] InterviewDto value)
        {
            if (value == null)
                return BadRequest("Invalid interview data.");

            var result = await _service.AddAsync(value);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        // PUT api/Interview/5
        [HttpPut("{id}")]
        public async Task<ActionResult<InterviewDto>> Put(int id, [FromBody] InterviewDto value)
        {
            if (value == null)
                return BadRequest("Invalid interview data.");

            var result = await _service.UpdateAsync(id, value);
            return Ok(result);
        }

        // DELETE api/Interview/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var isDeleted = await _service.DeleteAsync(id);
            if (!isDeleted)
                return NotFound();
            return Ok(true);
        }
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitInterview([FromBody] InterviewDto dto)
        {
            var interview = new InterviewDto
            {
                UserId = dto.UserId,
                Score = dto.Score
            };
            var user= await _userService.GetByIdAsync(dto.UserId);
            await _service.AddAsync(interview);
            var subject = "סיום המבחן";
            var body = $"שלום {user.FullName} קיבלת במבחן {interview.Score}";
            _emailService.SendEmailAsync(user.Email, subject, body);
            return Ok(interview);
        }
        [HttpGet("scores/{userId}")]
        public async Task<IActionResult> GetUserScores(int userId)
        {
            var interviews = await _service.GetUserInterviewsAsync(userId);

            var result = interviews
                .OrderBy(i => i.InterviewDate)
                .Select(i => new {
                    date = i.InterviewDate.ToString("yyyy-MM-dd"),
                    score = i.Score
                });

            return Ok(result);
        }
        [HttpGet("scores/all")]
        public async Task<ActionResult<Dictionary<int, List<InterviewScore>>>> GetAllUserScores()
        {
            var result = await _service.GetAllUserScoresAsync();
            return Ok(result);
        }

    }
}
