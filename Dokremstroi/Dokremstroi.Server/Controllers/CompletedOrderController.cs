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
                var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                Console.WriteLine("Validation errors: " + string.Join(", ", errors));
                return BadRequest(ModelState);
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

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] CompletedOrder order)
        {
            if (order == null)
            {
                return BadRequest("Order is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingOrder = await _completedOrderManager.GetByIdAsync(id);
            if (existingOrder == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            if (id != order.Id)
            {
                return BadRequest("ID из маршрута не совпадает с ID из объекта.");
            }

            // Обновите только изменённые свойства
            existingOrder.ProjectName = order.ProjectName;
            existingOrder.CompletionDate = order.CompletionDate;
            existingOrder.Images = order.Images;

            // Обновляем основные данные заказа
            await _completedOrderManager.UpdateAsync(existingOrder);

            // Обновляем изображения
            if (order.Images != null && order.Images.Any())
            {
                var existingImages = existingOrder.Images ?? new List<CompletedOrderImage>();

                // Удаляем отсутствующие изображения
                var imagesToRemove = existingImages.Where(img => !order.Images.Any(newImg => newImg.Id == img.Id)).ToList();
                foreach (var img in imagesToRemove)
                {
                    await _imageManager.DeleteAsync(img.Id);
                }

                // Добавляем или обновляем изображения
                foreach (var newImage in order.Images)
                {
                    if (newImage.Id == 0)
                    {
                        newImage.CompletedOrderId = id;
                        await _imageManager.AddAsync(newImage);
                    }
                    else
                    {
                        var existingImage = existingImages.FirstOrDefault(img => img.Id == newImage.Id);
                        if (existingImage != null)
                        {
                            existingImage.ImageUrl = newImage.ImageUrl;
                            await _imageManager.UpdateAsync(existingImage);
                        }
                    }
                }
            }

            return NoContent();
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompletedOrder>>> GetAll()
        {
            var orders = await _completedOrderManager.GetAllAsync();
            return Ok(orders);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _completedOrderManager.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            await _completedOrderManager.DeleteAsync(id);
            return NoContent();
        }

    }
}
