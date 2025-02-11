using Dokremstroi.Data.DTO;
using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController<User>
    {
        private readonly IUserManager _userManager;
        private readonly IConfiguration _configuration;

        public UserController(IManager<User> manager, IUserManager userManager, IConfiguration configuration) : base(manager)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        /// <summary>
        /// Регистрация нового пользователя
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
            {
                return ApiResponse(false, "Email и пароль обязательны. Пароль должен быть длиной не менее 6 символов.");
            }

            if (!IsValidEmail(dto.Username))
            {
                return ApiResponse(false, "Некорректный email.");
            }

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

        /// <summary>
        /// Авторизация пользователя
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return ApiResponse(false, "Email и пароль обязательны.");
            }

            var user = await _userManager.GetByUsernameAsync(dto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return ApiResponse(false, "Неверный email или пароль.");
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

        /// <summary>
        /// Генерация JWT-токена
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()) // ID пользователя
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Хеширование пароля
        /// </summary>
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        /// <summary>
        /// Проверка валидности email
        /// </summary>
        private bool IsValidEmail(string email)
        {
            return new EmailAddressAttribute().IsValid(email);
        }

        /// <summary>
        /// Формирование API-ответа
        /// </summary>
        private IActionResult ApiResponse(bool success, string message, object? data = null)
        {
            return Ok(new { success, message, data });
        }
    }
}
