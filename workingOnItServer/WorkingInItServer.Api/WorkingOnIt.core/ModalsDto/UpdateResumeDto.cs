using Microsoft.AspNetCore.Http;

public class UpdateResumeDto
{
    public int UserId { get; set; }
    public IFormFile Resume { get; set; } // קובץ קורות חיים חדש
}
