using Dokremstroi.Data.Models;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
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

        private void DeleteFile(string filePath)
        {
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
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

            // Получение существующих изображений из базы данных
            existingOrder.Images = (await _imageManager.GetFilteredAsync(img => img.CompletedOrderId == id)).ToList();

            // Обновляем основные данные заказа
            await _completedOrderManager.UpdateAsync(existingOrder);

            // Обновляем изображения
            if (images != null && images.Any())
            {
                var existingImages = existingOrder.Images ?? new List<CompletedOrderImage>();

                // Удаляем отсутствующие изображения только если коллекция existingOrder.Images не пустая и не null
                if (existingImages.Any())
                {
                    var imagesToRemove = existingImages.Where(img => order.Images == null || !order.Images.Any(newImg => newImg.Id == img.Id)).ToList();

                    foreach (var img in imagesToRemove)
                    {
                        await _imageManager.DeleteAsync(img.Id);
                        DeleteFile(Path.Combine(Directory.GetCurrentDirectory(), img.ImageUrl));
                    }
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

            var images = await _imageManager.GetFilteredAsync(img => img.CompletedOrderId == id);
            foreach (var img in images)
            {
                await _imageManager.DeleteAsync(img.Id);
                DeleteFile(Path.Combine(Directory.GetCurrentDirectory(), img.ImageUrl));
            }

            await _completedOrderManager.DeleteAsync(id);
            return NoContent();
        }


        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(
    [FromQuery] string? filter = null,
    [FromQuery] string? orderBy = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var filterExpression = CreateFilterExpression(filter);
            var orderByExpression = CreateOrderByExpression(orderBy);

            var (items, totalCount) = await _completedOrderManager.GetPagedAsync(
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

        private Expression<Func<CompletedOrder, bool>>? CreateFilterExpression(string? filter)
        {
            if (string.IsNullOrEmpty(filter))
            {
                return null;
            }

            var parts = filter.Split('=');
            if (parts.Length != 2)
            {
                return null;
            }

            var propertyName = parts[0];
            var propertyValue = parts[1];

            var parameter = Expression.Parameter(typeof(CompletedOrder), "x");
            var property = Expression.Property(parameter, propertyName);
            var constant = Expression.Constant(propertyValue, typeof(string));
            var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
            var containsExpression = Expression.Call(property, containsMethod, constant);

            return Expression.Lambda<Func<CompletedOrder, bool>>(containsExpression, parameter);
        }


        private Func<IQueryable<CompletedOrder>, IOrderedQueryable<CompletedOrder>>? CreateOrderByExpression(string? orderBy)
        {
            if (string.IsNullOrEmpty(orderBy))
            {
                return null;
            }

            var parts = orderBy.Split(':');
            if (parts.Length != 2)
            {
                return null;
            }

            var propertyName = parts[0];
            var direction = parts[1].ToLower();

            var parameter = Expression.Parameter(typeof(CompletedOrder), "x");
            var property = Expression.Property(parameter, propertyName);
            var lambda = Expression.Lambda(property, parameter);

            var orderByMethod = direction == "asc" ? "OrderBy" : "OrderByDescending";
            var method = typeof(Queryable).GetMethods()
                .Where(m => m.Name == orderByMethod && m.GetParameters().Length == 2)
                .Single()
                .MakeGenericMethod(typeof(CompletedOrder), property.Type);

            return (IQueryable<CompletedOrder> queryable) => (IOrderedQueryable<CompletedOrder>)method
                .Invoke(null, new object[] { queryable, lambda });
        }



    }
}
