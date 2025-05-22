using Amazon.Runtime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Core.ModalsDto;


namespace WorkingInIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController(IResumeService service, IHttpClientFactory httpClientFactory, JwtService tokenService,
    IUserService userService) : ControllerBase
    {
        private readonly JwtService _tokenService=tokenService;
        private readonly IUserService _userService=userService;
        private readonly IResumeService _service = service;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        // GET: api/Resume
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet]
        public async Task<ActionResult<List<ResumeDto>>> Get()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }
        [Authorize(Policy = "UserOrAdmin")]

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
        [Authorize(Policy = "UserOrAdmin")]
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
        //[Authorize(Policy = "UserOrAdmin")]
        //[HttpPost("upload")]
        //public async Task<IActionResult> UploadResume([FromForm] IFormFile file)
        //{
        //    try
        //    {
        //        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //        if (userIdClaim == null)
        //            return Unauthorized("User not found");

        //        if (!int.TryParse(userIdClaim.Value, out int userId))
        //            return BadRequest("Invalid user ID");

        //        Console.WriteLine($"User ID: {userId}, File Name: {file.FileName}");

        //        var fileUrl = await _service.UploadResumeAsync(userId, file);

        //        return Ok(new { fileUrl });

        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Upload error: {ex}");
        //        return StatusCode(500, ex.Message);
        //    }
        //}

        [Authorize(Policy = "UserOrAdmin")]
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

                // העלאת קובץ
                var fileUrl = await _service.UploadResumeAsync(userId, file);

                // קבלת אובייקט המשתמש
                var user = await _userService.GetByIdAsyncUser(userId);
                if (user == null)
                    return NotFound("User not found in DB");

                // יצירת טוקן חדש
                var token = _tokenService.GenerateToken(user);

                return Ok(new { fileUrl, token });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Upload error: {ex}");
                return StatusCode(500, ex.Message);
            }
        }


        [Authorize(Policy = "UserOrAdmin")]

        [HttpGet("download-url")]
        public async Task<IActionResult> GetResumeDownloadUrl()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var url = await _service.GetDownloadUrlAsync(userId);
            if (url == null) return NotFound("Resume not found.");
            return Ok(new { downloadUrl = url });
        }
        [Authorize(Policy = "UserOrAdmin")]

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

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeResume([FromBody] ResumeAnalysisRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FilePath))
            {
                return BadRequest("File path must be provided.");
            }

            var client = _httpClientFactory.CreateClient();

            var payload = new
            {
                filePath = request.FilePath
            };

            var pythonApiUrl = $"{Environment.GetEnvironmentVariable("PYTHON_API")}/upload_resume";

            Console.WriteLine(pythonApiUrl);
            try
            {
                var response = await client.PostAsJsonAsync(pythonApiUrl, payload);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"Python server error: {error}");
                }

                var result = await response.Content.ReadAsStringAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error communicating with Python server: {ex.Message}");
            }
        }




    }
}
