using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Dokremstroi.Data.DTO;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserOrderController : BaseController<UserOrder>
    {
        private readonly UserOrderServiceManager _userOrderServiceManager;

        public UserOrderController(IManager<UserOrder> manager, UserOrderServiceManager userOrderServiceManager) : base(manager)
        {
            _userOrderServiceManager = userOrderServiceManager;
        }

        [HttpPost("create-with-dto")]
        public async Task<ActionResult> CreateWithDto([FromBody] UserOrderDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest("Order is null.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = new UserOrder
            {
                TotalCost = orderDto.TotalCost,
                OrderDate = orderDto.OrderDate,
                Status = orderDto.Status,
                UserId = orderDto.UserId,
                UserOrderServices = orderDto.UserOrderServices?.Select(s => new UserOrderService
                {
                    ServiceId = s.ServiceId,
                    Quantity = s.Quantity,
                }).ToList()
            };

            await _manager.AddAsync(order);

            return CreatedAtAction(nameof(Get), new { id = order.Id }, orderDto);
        }
    }
}
