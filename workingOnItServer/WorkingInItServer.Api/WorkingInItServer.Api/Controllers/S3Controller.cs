using Microsoft.AspNetCore.Mvc;
using Recipes.Service.Services;
using WorkingOnIt.Core.InterfaceRepository;

namespace Warranty.API.Controllers
{

    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IS3Service _s3Service;


        public UploadController(IS3Service s3Server)
        {
            _s3Service = s3Server;
        }

        // ⬆️ שלב 1: קבלת URL להעלאת קובץ ל-S3
        [HttpGet("download-url/{userId}")]
        public async Task<IActionResult> GetDownloadUrl(int userId, [FromServices] IResumeRepository resumeRepository)
        {
            var resume = await resumeRepository.GetByUserIdAsync(userId);
            if (resume == null)
            {
                return NotFound("Resume not found.");
            }

            var url = await _s3Service.GetDownloadUrlAsync(resume.FilePath); // ✅ שולח את הנתיב המלא!
            return Ok(new { downloadUrl = url });
        }


        // ⬇️ שלב 2: קבלת URL להורדת קובץ מה-S3
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }


    }
}