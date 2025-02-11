using Dokremstroi.Data.DTO;
using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

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

        protected override Expression<Func<UserOrder, bool>> CreateFilterExpression(string? filter)
        {
            if (string.IsNullOrEmpty(filter))
            {
                return uo => true;
            }

            var parameter = Expression.Parameter(typeof(UserOrder), "x");
            var userIdProperty = Expression.Property(parameter, "UserId");
            var totalCostProperty = Expression.Property(parameter, "TotalCost");
            var orderDateProperty = Expression.Property(parameter, "OrderDate");
            var statusProperty = Expression.Property(parameter, "Status");

            var filterExpression = Expression.OrElse(
                Expression.OrElse(
                    Expression.Call(
                        Expression.Call(userIdProperty, "ToString", null),
                        "Contains",
                        null,
                        Expression.Constant(filter)
                    ),
                    Expression.Call(
                        Expression.Call(totalCostProperty, "ToString", null),
                        "Contains",
                        null,
                        Expression.Constant(filter)
                    )
                ),
                Expression.OrElse(
                    Expression.Call(
                        Expression.Call(orderDateProperty, "ToString", null),
                        "Contains",
                        null,
                        Expression.Constant(filter)
                    ),
                    Expression.Call(statusProperty, "Contains", null, Expression.Constant(filter))
                )
            );

            return Expression.Lambda<Func<UserOrder, bool>>(filterExpression, parameter);
        }


        [HttpGet("paged")]
        public override async Task<ActionResult<IEnumerable<UserOrder>>> GetPaged(
            [FromQuery] string? filter,
            [FromQuery] string? orderBy,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            return await base.GetPaged(filter, orderBy, page, pageSize);
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
