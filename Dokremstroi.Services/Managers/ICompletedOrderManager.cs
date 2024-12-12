using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public interface ICompletedOrderManager : IManager<CompletedOrder>
    {
        Task AddOrderWithImagesAsync(CompletedOrder order);
    }
}
