using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WorkingOnIt.Core.Entities;

public class JwtService
{
    private readonly string _jwtSecret;

    public JwtService()
    {
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("JWT_SECRET is not set");
    }

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        // 📌 לוודא שהתפקיד נטען כראוי
        if (!string.IsNullOrEmpty(user.Role?.NameRole))
        {
            claims.Add(new Claim(ClaimTypes.Role, user.Role.NameRole));
        }
        else
        {
            throw new Exception("User role is missing!");
        }

        var token = new JwtSecurityToken(
            issuer: "https://yourdomain.com", // 📌 הוסף Issuer
            audience: "https://yourdomain.com", // 📌 הוסף Audience
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
