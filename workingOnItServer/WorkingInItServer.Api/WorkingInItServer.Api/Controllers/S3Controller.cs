
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;
using Microsoft.AspNetCore.Http;


namespace Warranty.API.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IS3Service _s3Service;

        public UploadController(IS3Service s3Service)
        {
            _s3Service = s3Service;
        }

        // ⬆️ שלב 1: קבלת URL חתום להעלאת קובץ ל-S3
        [HttpGet("upload-url/{fileName}")]
        public async Task<IActionResult> GetUploadUrl(string fileName)
        {
            var presignedUrl = await _s3Service.GeneratePresignedUploadUrlAsync(fileName, "application/pdf");
            return Ok(new { uploadUrl = presignedUrl });
        }

        // ⬇️ שלב 2: קבלת URL חתום להורדת קובץ לפי `userId`
        [HttpGet("download-url/{userId}")]
        public async Task<IActionResult> GetUserResumeDownloadUrl(int userId, [FromServices] IResumeRepository resumeRepository)
        {
            var resume = await resumeRepository.GetByUserIdAsync(userId);
            if (resume == null)
            {
                return NotFound("Resume not found.");
            }

            var url = await _s3Service.GeneratePresignedDownloadUrlAsync(resume.FilePath);
            return Ok(new { downloadUrl = url });
        }

        // ⬇️ שלב 3: קבלת URL חתום להורדת קובץ לפי שם קובץ
        [HttpGet("presigned-url/{fileName}")]
        public async Task<IActionResult> GetUserResumeDownloadUrl(string fileName)
        {
            var url = await _s3Service.GeneratePresignedDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }

        // ⬆️ שלב 4: העלאת קובץ ישירות ל-S3 (למי שלא משתמש ב-Presigned URL)
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            var fileUrl = await _s3Service.UploadFileAsync(file);
            return Ok(new { fileUrl });
        }
    }
}
