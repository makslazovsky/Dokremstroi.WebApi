using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class CompletedOrderManager : ManagerBase<CompletedOrder>, ICompletedOrderManager
    {

        private readonly IRepository<CompletedOrderImage> _imageRepository;

        public CompletedOrderManager(IRepository<CompletedOrder> repository, IRepository<CompletedOrderImage> imageRepository)
            : base(repository)
        {
            _imageRepository = imageRepository;
        }

        public async Task AddOrderWithImagesAsync(CompletedOrder order)
        {
            await _repository.AddAsync(order);

            if (order.Images != null)
            {
                foreach (var image in order.Images)
                {
                    image.CompletedOrderId = order.Id;
                    await _imageRepository.AddAsync(image);
                }
            }
        }

        public async Task<(IEnumerable<CompletedOrder> Items, int TotalCount)> GetPagedAsync(
            Expression<Func<CompletedOrder, bool>> filter = null,
            Func<IQueryable<CompletedOrder>, IOrderedQueryable<CompletedOrder>> orderBy = null,
            int page = 1,
            int pageSize = 10)
        {
            return await _repository.GetPagedAsync(filter, orderBy, page, pageSize);
        }
    }
}
