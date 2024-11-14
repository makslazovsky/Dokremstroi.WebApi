using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class CompletedOrderImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } // URL изображения

        // Навигационные свойства
        public int CompletedOrderId { get; set; }
        public CompletedOrder CompletedOrder { get; set; }
    }
}
