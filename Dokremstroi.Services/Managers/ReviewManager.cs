using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class ReviewManager : ManagerBase<Review>, IReviewManager
    {
        public ReviewManager(IRepository<Review> repository) : base(repository) { }

        public async Task<bool> HasReviewAsync(int orderId, int userId)
        {
            return await _repository.ExistsAsync(r => r.UserOrderId == orderId && r.UserId == userId);
        }
    }
}
