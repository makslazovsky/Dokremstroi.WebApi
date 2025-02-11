using Dokremstroi.Data.Models;
using Dokremstroi.Server.Controllers;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

[Route("api/[controller]")]
[ApiController]
public class ServiceController : BaseController<Service>
{
    public ServiceController(IManager<Service> manager) : base(manager) { }

    protected override Expression<Func<Service, bool>> CreateFilterExpression(string? filter)
    {
        if (string.IsNullOrEmpty(filter))
        {
            return s => true;
        }

        var parameter = Expression.Parameter(typeof(Service), "x");
        var nameProperty = Expression.Property(parameter, "Name");
        var descriptionProperty = Expression.Property(parameter, "Description");
        var groupNameProperty = Expression.Property(parameter, "GroupName");

        var filterExpression = Expression.OrElse(
            Expression.OrElse(
                Expression.Call(nameProperty, "Contains", null, Expression.Constant(filter)),
                Expression.Call(descriptionProperty, "Contains", null, Expression.Constant(filter))
            ),
            Expression.Call(groupNameProperty, "Contains", null, Expression.Constant(filter))
        );

        return Expression.Lambda<Func<Service, bool>>(filterExpression, parameter);
    }

    [HttpGet("paged")]
    public override async Task<ActionResult<IEnumerable<Service>>> GetPaged(
        [FromQuery] string? filter,
        [FromQuery] string? orderBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        return await base.GetPaged(filter, orderBy, page, pageSize);
    }
}
