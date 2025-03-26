using Microsoft.AspNetCore.Mvc;
using Recipes.Service.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Service.Services;

namespace WorkingInIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController(IResumeService service) : ControllerBase
    {
        private readonly IResumeService _service = service;

        // GET: api/Resume
        [HttpGet]
        public async Task<ActionResult<List<ResumeDto>>> Get()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // GET api/Resume/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ResumeDto>> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        // POST api/Resume
        [HttpPost]
        public async Task<ActionResult<ResumeDto>> Post([FromBody] ResumeDto value)
        {
            var result = await _service.AddAsync(value);
            if (result != null)
                return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
            return BadRequest(value);
        }

        //// PUT api/Resume/5
        //[HttpPut("{id}")]
        //public async Task<ActionResult<ResumeDto>> Put(int id, [FromBody] ResumeDto value)
        //{
        //    var result = await _service.UpdateResumeAsync(id, value);
        //    if (result == null)
        //        return NotFound();
        //    return Ok(result);
        //}

        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume([FromForm] IFormFile file)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User not found");

                if (!int.TryParse(userIdClaim.Value, out int userId))
                    return BadRequest("Invalid user ID");

                Console.WriteLine($"User ID: {userId}, File Name: {file.FileName}");

                var fileUrl = await _service.UploadResumeAsync(userId, file);
                return Ok(new { fileUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Upload error: {ex}");
                return StatusCode(500, ex.Message);
            }
        }





        [HttpGet("download-url")]
        public async Task<IActionResult> GetResumeDownloadUrl()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var url = await _service.GetDownloadUrlAsync(userId);
            if (url == null) return NotFound("Resume not found.");
            return Ok(new { downloadUrl = url });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateResume([FromForm] IFormFile file)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User not found");

                if (!int.TryParse(userIdClaim.Value, out int userId))
                    return BadRequest("Invalid user ID");

                var fileUrl = await _service.UpdateResumeAsync(userId, file);
                return Ok(new { fileUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Update error: {ex}");
                return StatusCode(500, ex.Message);
            }
        }





    }
}
