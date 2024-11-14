using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<T> : ControllerBase where T : class
    {
        private readonly IManager<T> _manager;

        public BaseController(IManager<T> manager)
        {
            _manager = manager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<T>>> GetAll()
        {
            var items = await _manager.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<T>> Get(int id)
        {
            var item = await _manager.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult> Create(T item)
        {
            await _manager.AddAsync(item);
            return CreatedAtAction(nameof(Get), new { id = item.GetHashCode() }, item);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, T item)
        {
            if (id != item.GetHashCode()) // замените проверку по id на реальную проверку, если необходимо
            {
                return BadRequest();
            }

            await _manager.UpdateAsync(item);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _manager.DeleteAsync(id);
            return NoContent();
        }
    }
}
