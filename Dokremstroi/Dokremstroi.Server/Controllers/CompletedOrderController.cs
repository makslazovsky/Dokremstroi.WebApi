using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompletedOrderController : BaseController<CompletedOrder>
    {
        public CompletedOrderController(IManager<CompletedOrder> manager) : base(manager) { }
    }
}
