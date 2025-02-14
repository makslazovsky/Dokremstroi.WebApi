using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : BaseController<Review>
    {
        public ReviewController(IManager<Review> manager) : base(manager)
        {

        }



        [HttpGet("byOrderId/{orderId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetByOrderId(int orderId)
        {
            var reviews = await _manager.GetFilteredAsync(r => r.UserOrderId == orderId);
            if (reviews == null || !reviews.Any())
            {
                return NotFound();
            }
            return Ok(reviews);
        }

        [HttpGet("approved/paged")]
        public async Task<ActionResult<IEnumerable<Review>>> GetApprovedPaged(
    [FromQuery] string? filter,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            Expression<Func<Review, bool>> filterExpression = r => r.IsApproved;

            if (!string.IsNullOrEmpty(filter))
            {
                filterExpression = filterExpression.AndAlso(r => r.Comment.Contains(filter));
            }

            var (items, totalCount) = await _manager.GetPagedAsync(
                filterExpression,
                q => q.OrderBy(r => r.Id),
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




        [HttpPost("approveAll")]
        public async Task<IActionResult> ApproveAll()
        {
            var reviews = await _manager.GetFilteredAsync(r => !r.IsApproved);
            foreach (var review in reviews)
            {
                review.IsApproved = true;
                await _manager.UpdateAsync(review);
            }
            return NoContent();
        }

        [HttpDelete("deleteUnapproved")]
        public async Task<IActionResult> DeleteUnapproved()
        {
            var reviews = await _manager.GetFilteredAsync(r => !r.IsApproved);
            foreach (var review in reviews)
            {
                await _manager.DeleteAsync(review.Id);
            }
            return NoContent();
        }

        [HttpGet("unapproved/paged")]
        public async Task<ActionResult<IEnumerable<Review>>> GetUnapprovedPaged(
     [FromQuery] string? filter,
     [FromQuery] int page = 1,
     [FromQuery] int pageSize = 10)
        {
            Expression<Func<Review, bool>> filterExpression = r => !r.IsApproved;

            if (!string.IsNullOrEmpty(filter))
            {
                filterExpression = filterExpression.AndAlso(r => r.Comment.Contains(filter));
            }

            var (items, totalCount) = await _manager.GetPagedAsync(
                filterExpression,
                q => q.OrderBy(r => r.Id),
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

        private Expression<Func<Review, bool>> CreateFilterExpressionForUser(string? filter, int userId)
        {
            var parameter = Expression.Parameter(typeof(Review), "r");
            var userIdProperty = Expression.Property(parameter, "UserId");
            var userIdConstant = Expression.Constant(userId);
            var userIdExpression = Expression.Equal(userIdProperty, userIdConstant);
            var filterExpression = userIdExpression;

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
                        var constant = Expression.Constant(propertyValue, typeof(string));
                        var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                        var containsExpression = Expression.Call(property, containsMethod, constant);
                        filterExpression = Expression.AndAlso(filterExpression, containsExpression);
                    }
                }
            }

            return Expression.Lambda<Func<Review, bool>>(filterExpression, parameter);
        }




    }
}
