using Dokremstroi.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Repositories
{
    public class CompletedOrderRepository : Repository<CompletedOrder>
    {
        public CompletedOrderRepository(DokremstroiContext context) : base(context) { }

        public override async Task<CompletedOrder> GetByIdAsync(int id)
        {
            return await _context.CompletedOrders
                .Include(o => o.Images) // Подгружаем связанные изображения
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public override async Task<IEnumerable<CompletedOrder>> GetAllAsync()
        {
            return await _context.CompletedOrders
                .Include(o => o.Images) // Подгружаем связанные изображения
                .ToListAsync();
        }
    }
}
