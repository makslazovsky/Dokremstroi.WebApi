using Dokremstroi.Data.DTO;
using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController<User>
    {
        private readonly IUserManager _userManager;

        public UserController(IManager<User> manager, IUserManager userManager) : base(manager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
        {
            if (string.IsNullOrEmpty(dto.Username) || string.IsNullOrEmpty(dto.Password) || dto.Password.Length < 6)
            {
                return ApiResponse(false, "Email и пароль обязательны. Пароль должен быть длиной не менее 6 символов.");
            }

            try
            {
                var userExists = await _userManager.GetByUsernameAsync(dto.Username);
                if (userExists != null)
                {
                    return ApiResponse(false, "Пользователь с таким email уже зарегистрирован.");
                }

                var user = new User
                {
                    Username = dto.Username,
                    PasswordHash = HashPassword(dto.Password),
                    Role = "Client"
                };

                await _userManager.AddAsync(user);

                return ApiResponse(true, "Пользователь успешно зарегистрирован.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Ошибка при регистрации: " + ex.Message);
                return ApiResponse(false, "Произошла ошибка при регистрации.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Username) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { success = false, message = "Email и пароль обязательны к заполнению.", data = (object)null });
            }

            var user = await _userManager.GetByUsernameAsync(dto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return BadRequest(new { success = false, message = "Неверный email или пароль.", data = (object)null });
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                success = true,
                message = "Успешный вход!",
                data = new
                {
                    username = user.Username,
                    role = user.Role,
                    token = token
                }
            });
        }


        // Метод для генерации JWT
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKey12345")); // Совпадает с Jwt:Key
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role)
    };

            var token = new JwtSecurityToken(
                issuer: "DokremstroiApp",
                audience: "DokremstroiApp",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private IActionResult ApiResponse(bool success, string message, object? data = null)
        {
            return Ok(new { success, message, data });
        }
    }
}
