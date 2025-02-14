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
            var parameter = Expression.Parameter(typeof(UserOrder), "x");
            Expression filterExpression = Expression.Constant(true, typeof(bool)); // Начальное выражение: всегда true

            if (!string.IsNullOrEmpty(filter))
            {
                var userIdProperty = Expression.Property(parameter, "UserId");
                var totalCostProperty = Expression.Property(parameter, "TotalCost");
                var orderDateProperty = Expression.Property(parameter, "OrderDate");
                var statusProperty = Expression.Property(parameter, "Status");

                var filterParts = filter.Split(';'); // Ожидаем, что фильтры будут разделены точкой с запятой

                foreach (var part in filterParts)
                {
                    var propertyFilter = part.Split('=');
                    if (propertyFilter.Length == 2)
                    {
                        var propertyName = propertyFilter[0];
                        var propertyValue = propertyFilter[1];

                        Expression? property = propertyName switch
                        {
                            "UserId" => userIdProperty,
                            "TotalCost" => totalCostProperty,
                            "OrderDate" => orderDateProperty,
                            "Status" => statusProperty,
                            _ => null
                        };

                        if (property != null)
                        {
                            var constant = Expression.Constant(propertyValue);
                            var toStringMethod = property.Type.GetMethod("ToString", Type.EmptyTypes);
                            var toStringExpression = Expression.Call(property, toStringMethod);
                            var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                            var containsExpression = Expression.Call(toStringExpression, containsMethod, constant);
                            filterExpression = Expression.AndAlso(filterExpression, containsExpression);
                        }
                    }
                }
            }

            return Expression.Lambda<Func<UserOrder, bool>>(filterExpression, parameter);
        }

        [HttpGet("pagedForUser")]
        public async Task<IActionResult> GetPagedForUser(
    [FromQuery] int userId,
    [FromQuery] string? filter = null,
    [FromQuery] string? orderBy = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var filterExpression = CreateFilterExpressionForUser(filter, userId);
            var orderByExpression = CreateOrderByExpression(orderBy);

            var (items, totalCount) = await _manager.GetPagedAsync(
                filterExpression,
                orderByExpression,
                page,
                pageSize
            );

            var result = new
            {
                Items = items,
                TotalCount = totalCount
            };

            return Ok(result);
        }

        private Expression<Func<UserOrder, bool>> CreateFilterExpressionForUser(string? filter, int userId)
        {
            var parameter = Expression.Parameter(typeof(UserOrder), "uo");
            var userIdProperty = Expression.Property(parameter, "UserId");
            var userIdConstant = Expression.Constant(userId);
            var userIdExpression = Expression.Equal(userIdProperty, userIdConstant);

            Expression filterExpression = userIdExpression; // Начальное выражение: всегда true для userId

            if (!string.IsNullOrEmpty(filter))
            {
                var filterParts = filter.Split(';'); // Ожидаем, что фильтры будут разделены точкой с запятой

                foreach (var part in filterParts)
                {
                    var propertyFilter = part.Split('=');
                    if (propertyFilter.Length == 2)
                    {
                        var propertyName = propertyFilter[0];
                        var propertyValue = propertyFilter[1];

                        var property = Expression.Property(parameter, propertyName);
                        Expression? containsExpression = null;

                        if (property.Type == typeof(DateTime))
                        {
                            string[] formats = { "yyyy-MM-ddTHH:mm:ss.fffZ", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-dd" };
                            if (DateTime.TryParseExact(propertyValue, formats, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime dateValue))
                            {
                                // Сравниваем только дату без учета времени
                                var dateProperty = Expression.Property(property, "Date");
                                var dateConstant = Expression.Constant(dateValue.Date);
                                containsExpression = Expression.Equal(dateProperty, dateConstant);
                            }
                        }
                        else
                        {
                            var constant = Expression.Constant(propertyValue, typeof(string));
                            var toStringMethod = typeof(object).GetMethod("ToString", Type.EmptyTypes);
                            var toStringExpression = Expression.Call(property, toStringMethod);
                            var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                            containsExpression = Expression.Call(toStringExpression, containsMethod, constant);
                        }

                        if (containsExpression != null)
                        {
                            filterExpression = Expression.AndAlso(filterExpression, containsExpression);
                        }
                    }
                }
            }

            return Expression.Lambda<Func<UserOrder, bool>>(filterExpression, parameter);
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
