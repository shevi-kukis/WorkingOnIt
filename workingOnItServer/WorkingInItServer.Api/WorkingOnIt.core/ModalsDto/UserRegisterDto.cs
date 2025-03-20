using Microsoft.AspNetCore.Http;

public class UserRegisterDto
{
    public string FullName { get; set; }
    public string PasswordHash { get; set; }
    public string Email { get; set; }
    public IFormFile Resume { get; set; } // קובץ קורות חיים
}