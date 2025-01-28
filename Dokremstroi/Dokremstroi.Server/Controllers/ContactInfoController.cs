using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.Server.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactInfoController : BaseController<ContactInfo>
    {
        public ContactInfoController(IManager<ContactInfo> manager) : base(manager) { }

        // Переопределяем метод Get для работы только с одной записью
        [HttpGet]
        public override async Task<ActionResult<IEnumerable<ContactInfo>>> GetAll()
        {
            var contactInfo = await _manager.GetAllAsync();
            return Ok(contactInfo.FirstOrDefault());
        }

        [AllowAnonymous]
        [HttpGet("single")]
        public async Task<ActionResult<ContactInfo>> GetSingle()
        {
            var item = (await _manager.GetAllAsync()).FirstOrDefault();
            if (item == null)
            {
                // Создаем запись с стандартными значениями
                var defaultContactInfo = new ContactInfo
                {
                    Address = "123 Standard St, Standard City",
                    PhoneNumber = "123-456-7890",
                    Email = "example@domain.com",
                    MapLink = "http://maps.example.com",
                    BankDetails = "Bank: Standard Bank, Account: 12345678"
                };

                await _manager.AddAsync(defaultContactInfo);
                item = defaultContactInfo;
            }

            return Ok(item);
        }

        // Вы можете оставить другие методы, если в будущем понадобится их использовать
    }
}
