using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace Dokremstroi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<T> : ControllerBase where T : class
    {
        protected readonly IManager<T> _manager;

        public BaseController(IManager<T> manager)
        {
            _manager = manager;
        }

        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
        {
            var items = await _manager.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public virtual async Task<ActionResult<T>> Get(int id)
        {
            var item = await _manager.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public virtual async Task<ActionResult> Create(T item)
        {
            await _manager.AddAsync(item);
            return CreatedAtAction(nameof(Get), new { id = item.GetHashCode() }, item);
        }

        [HttpPut("{id}")]
        public virtual async Task<ActionResult> Update(int id, T item)
        {
            // Проверяем, что объект имеет свойство Id
            var itemIdProperty = typeof(T).GetProperty("Id");
            if (itemIdProperty == null)
            {
                return BadRequest("Модель не содержит свойства Id.");
            }

            // Получаем значение Id из объекта
            var itemIdValue = (int)itemIdProperty.GetValue(item);

            // Проверяем совпадение ID из маршрута и тела
            if (id != itemIdValue)
            {
                return BadRequest("ID из маршрута не совпадает с ID из объекта.");
            }

            await _manager.UpdateAsync(item);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public virtual async Task<ActionResult> Delete(int id)
        {
            await _manager.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("filter")]
        public virtual async Task<ActionResult<IEnumerable<T>>> GetFiltered([FromQuery] string filter)
        {
            // Преобразуем строку filter в выражение
            var predicate = CreateFilterExpression(filter);

            if (predicate == null)
            {
                return BadRequest("Некорректный фильтр.");
            }

            var items = await _manager.GetFilteredAsync(predicate);
            return Ok(items);
        }



        private Expression<Func<T, bool>>? CreateFilterExpression(string filter)
        {
            if (string.IsNullOrEmpty(filter))
            {
                return null;
            }

            // Пример: filter в формате "PropertyName=Value"
            var parts = filter.Split('=');
            if (parts.Length != 2)
            {
                return null; // Неверный формат
            }

            var propertyName = parts[0];
            var propertyValue = parts[1];

            // Получаем свойство типа T
            var parameter = Expression.Parameter(typeof(T), "x");
            var property = Expression.Property(parameter, propertyName);

            // Преобразуем значение фильтра в правильный тип
            var constant = Expression.Constant(Convert.ChangeType(propertyValue, property.Type));

            // Создаём выражение x => x.PropertyName == Value
            var equality = Expression.Equal(property, constant);
            return Expression.Lambda<Func<T, bool>>(equality, parameter);
        }

        [HttpGet("paged")]
        public virtual async Task<ActionResult<IEnumerable<T>>> GetPaged(
    [FromQuery] string filter,
    [FromQuery] string orderBy,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            // Преобразуем строку filter в выражение
            var filterExpression = CreateFilterExpression(filter);

            // Преобразуем строку orderBy в выражение
            var orderByExpression = CreateOrderByExpression(orderBy);

            var (items, totalCount) = await _manager.GetPagedAsync(
                filterExpression,
                orderByExpression,
                page,
                pageSize
            );

            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            return Ok(items);
        }

        private Func<IQueryable<T>, IOrderedQueryable<T>>? CreateOrderByExpression(string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy))
            {
                return null;
            }

            // Пример: orderBy в формате "PropertyName:asc"
            var parts = orderBy.Split(':');
            if (parts.Length != 2)
            {
                return null; // Неверный формат
            }

            var propertyName = parts[0];
            var direction = parts[1].ToLower();

            // Получаем свойство типа T
            var parameter = Expression.Parameter(typeof(T), "x");
            var property = Expression.Property(parameter, propertyName);
            var lambda = Expression.Lambda(property, parameter);

            var orderByMethod = direction == "asc" ? "OrderBy" : "OrderByDescending";
            var orderByExpression = Expression.Call(
                typeof(Queryable),
                orderByMethod,
                new Type[] { typeof(T), property.Type },
                parameter,
                lambda
            );

            return (IQueryable<T> queryable) => (IOrderedQueryable<T>)queryable.Provider.CreateQuery(orderByExpression);
        }


    }

}
