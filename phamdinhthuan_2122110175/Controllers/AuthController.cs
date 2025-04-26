
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using phamdinhthuan_2122110175.Models;
using phamdinhthuan_2122110175.Data;
namespace phamdinhthuan_2122110175.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Users
                .Where(u => u.Username == dto.Username && u.Password == dto.Password)
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.Role
                })
                .FirstOrDefault();

            if (user == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu.");

            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>
    {
        new Claim("UserId", user.UserId.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role) // Thêm Role vào JWT
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = "your-app",
                Audience = "your-app"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                username = user.Username,
                role = user.Role // Trả về role cùng token
            });
        }

    }
}

