using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactInfoController : BaseController<ContactInfo>
    {
        public ContactInfoController(IManager<ContactInfo> manager) : base(manager) { }
    }
}
