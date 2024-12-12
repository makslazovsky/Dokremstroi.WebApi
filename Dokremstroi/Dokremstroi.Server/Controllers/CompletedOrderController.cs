using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dokremstroi.Server.Controllers
{
    //[Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class CompletedOrderController : ControllerBase
    {
        private readonly ICompletedOrderManager _completedOrderManager;
        private readonly IManager<CompletedOrderImage> _imageManager;

        public CompletedOrderController(ICompletedOrderManager completedOrderManager, IManager<CompletedOrderImage> imageManager)
        {
            _completedOrderManager = completedOrderManager;
            _imageManager = imageManager;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CompletedOrder order)
        {
            if (order == null)
            {
                return BadRequest("Order is null.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Посмотрите, что именно возвращается
            }
            // Сохраняем выполненный заказ
            await _completedOrderManager.AddAsync(order);

            // Сохраняем изображения (если есть)
            if (order.Images != null && order.Images.Any())
            {
                for (int i = 0; i < order.Images.Count; i++)
                {
                    var image = order.Images[i];
                    image.CompletedOrderId = order.Id; // Привязываем изображение к заказу
                    image.CompletedOrder = null; // Убираем циклическую зависимость
                    await _imageManager.AddAsync(image);
                }
            }


            return CreatedAtAction(nameof(Get), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompletedOrder>> Get(int id)
        {
            var order = await _completedOrderManager.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompletedOrder>>> GetAll()
        {
            var orders = await _completedOrderManager.GetAllAsync();
            return Ok(orders);
        }
    }
}
