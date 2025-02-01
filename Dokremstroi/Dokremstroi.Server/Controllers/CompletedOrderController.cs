using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Dokremstroi.Server.Controllers
{
    //[Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class CompletedOrderController : ControllerBase
    {
        private readonly ICompletedOrderManager _completedOrderManager;
        private readonly IManager<CompletedOrderImage> _imageManager;
        private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

        public CompletedOrderController(ICompletedOrderManager completedOrderManager, IManager<CompletedOrderImage> imageManager)
        {
            _completedOrderManager = completedOrderManager;
            _imageManager = imageManager;

            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm] CompletedOrder order, [FromForm] List<IFormFile> images)
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
            if (images != null && images.Any())
            {
                for (int i = 0; i < images.Count; i++)
                {
                    var imageFile = images[i];
                    var fileName = Path.GetRandomFileName() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine(_uploadFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    var image = new CompletedOrderImage
                    {
                        ImageUrl = $"uploads/{fileName}",
                        CompletedOrderId = order.Id
                    };
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

        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<CompletedOrderImage>>> GetImages(int id)
        {
            var images = await _imageManager.GetFilteredAsync(img => img.CompletedOrderId == id);
            if (images == null || !images.Any())
            {
                return NotFound();
            }
            return Ok(images);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromForm] CompletedOrder order, [FromForm] List<IFormFile> images)
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
            existingOrder.ProjectName = order.ProjectName;
            existingOrder.CompletionDate = order.CompletionDate;
            existingOrder.Images = order.Images;

            // Обновляем основные данные заказа
            await _completedOrderManager.UpdateAsync(existingOrder);

            // Обновляем изображения
            if (images != null && images.Any())
            {
                var existingImages = existingOrder.Images ?? new List<CompletedOrderImage>();

                // Удаляем отсутствующие изображения
                var imagesToRemove = existingImages.Where(img => !order.Images.Any(newImg => newImg.Id == img.Id)).ToList();
                foreach (var img in imagesToRemove)
                {
                    await _imageManager.DeleteAsync(img.Id);
                }

                // Добавляем или обновляем изображения
                foreach (var imageFile in images)
                {
                    var fileName = Path.GetRandomFileName() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine(_uploadFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    var image = new CompletedOrderImage
                    {
                        ImageUrl = $"uploads/{fileName}",
                        CompletedOrderId = id
                    };
                    await _imageManager.AddAsync(image);
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
