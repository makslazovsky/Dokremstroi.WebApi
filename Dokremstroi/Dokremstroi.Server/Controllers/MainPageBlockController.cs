using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainPageBlockController : BaseController<MainPageBlock>
    {
        public MainPageBlockController(IManager<MainPageBlock> manager) : base(manager) { }

        // Добавьте дополнительные методы, если нужно
    }
}
