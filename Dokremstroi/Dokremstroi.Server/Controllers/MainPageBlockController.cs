using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainPageBlockController : BaseController<MainPageBlock>
    {
        public MainPageBlockController(IManager<MainPageBlock> manager) : base(manager) { }

        protected override Expression<Func<MainPageBlock, bool>> CreateFilterExpression(string? filter)
        {
            if (string.IsNullOrEmpty(filter))
            {
                return mpb => true;
            }

            var parameter = Expression.Parameter(typeof(MainPageBlock), "x");
            var titleProperty = Expression.Property(parameter, "Title");
            var contentProperty = Expression.Property(parameter, "Content");
            var imageUrlProperty = Expression.Property(parameter, "ImageUrl");

            var filterExpression = Expression.OrElse(
                Expression.OrElse(
                    Expression.Call(titleProperty, "Contains", null, Expression.Constant(filter)),
                    Expression.Call(contentProperty, "Contains", null, Expression.Constant(filter))
                ),
                Expression.Call(imageUrlProperty, "Contains", null, Expression.Constant(filter))
            );

            return Expression.Lambda<Func<MainPageBlock, bool>>(filterExpression, parameter);
        }

        [HttpGet("paged")]
        public override async Task<ActionResult<IEnumerable<MainPageBlock>>> GetPaged(
            [FromQuery] string? filter,
            [FromQuery] string? orderBy,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            return await base.GetPaged(filter, orderBy, page, pageSize);
        }
    }
}
