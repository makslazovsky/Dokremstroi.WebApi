using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserOrderController : BaseController<UserOrder>
    {
        public UserOrderController(IManager<UserOrder> manager) : base(manager) { }
    }
}
