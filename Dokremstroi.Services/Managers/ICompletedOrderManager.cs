using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public interface ICompletedOrderManager : IManager<CompletedOrder>
    {
        Task AddOrderWithImagesAsync(CompletedOrder order);
        Task<(IEnumerable<CompletedOrder> Items, int TotalCount)> GetPagedAsync(
            Expression<Func<CompletedOrder, bool>> filter = null,
            Func<IQueryable<CompletedOrder>, IOrderedQueryable<CompletedOrder>> orderBy = null,
            int page = 1,
            int pageSize = 10);
    }

}
