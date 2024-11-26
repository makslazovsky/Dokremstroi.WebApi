using Dokremstroi.Data.DTO;
using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
            if (string.IsNullOrEmpty(dto.Username) || string.IsNullOrEmpty(dto.Password) && dto.Password.Length>=6)
            {
                return BadRequest("Email и пароль обязательны к заполнению");
            }

            var userExists = await _userManager.GetByUsernameAsync(dto.Username);
            if (userExists != null)
            {
                return BadRequest("Пользователь с таким email уже зарегистрирован");
            }

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = HashPassword(dto.Password), // Используем ранее добавленный метод для хеширования
                Role = "Client"
            };

            await _userManager.AddAsync(user);
            return Ok(new { message = "Пользователь успешно зраегистрирован" });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

    }

}
