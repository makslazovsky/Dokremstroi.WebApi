using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Mvc;
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
        public ReviewController(IManager<Review> manager) : base(manager) { }

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
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            Expression<Func<Review, bool>> filterExpression = r => r.IsApproved;
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
    }
}
