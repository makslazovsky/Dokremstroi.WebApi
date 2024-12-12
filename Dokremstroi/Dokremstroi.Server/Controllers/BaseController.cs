using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    }

}
