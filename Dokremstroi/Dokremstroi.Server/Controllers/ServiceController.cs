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
    public class ServiceController : BaseController<Service>
    {
        public ServiceController(IManager<Service> manager) : base(manager) { }

        // Дополнительные методы, специфичные для Service, если потребуется
    }
}
