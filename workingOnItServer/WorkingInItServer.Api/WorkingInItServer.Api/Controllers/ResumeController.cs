using Microsoft.AspNetCore.Mvc;
using Recipes.Service.Services;
using System.Collections.Generic;
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

        // PUT api/Resume/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ResumeDto>> Put(int id, [FromBody] ResumeDto value)
        {
            var result = await _service.UpdateAsync(id, value);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        // DELETE api/Resume/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound();
            return Ok(result);
        }
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetResume(int userId)
        {
            var resume = await _service.GetResumeByUserId(userId);

            if (resume == null)
            {
                return NotFound(new { message = "Resume not found" });
            }

            return Ok(resume);
        }
        [HttpPost("update-resume/{userId}")]
        public async Task<IActionResult> UpdateResume(int userId, [FromForm] IFormFile file, [FromServices] IS3Service s3Service)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            var resume = await _service.GetResumeByUserId(userId);
            if (resume == null)
            {
                return NotFound(new { message = "Resume not found for this user" });
            }

            // העלאת קובץ חדש ל-S3
            string filePath = await s3Service.UploadFileAsync(file);

            // עדכון הנתיב במסד הנתונים
            resume.FilePath = filePath;
            await _service.UpdateAsync(resume.Id, resume);

            return Ok(new { message = "Resume updated successfully", filePath });
        }

    }
}
