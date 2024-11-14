using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class CompletedOrder
    {
        public int Id { get; set; }
        public string ProjectName { get; set; } // Название проекта или объекта
        public DateTime CompletionDate { get; set; } // Дата завершения

        // Навигационные свойства
        public int ServiceId { get; set; }
        public Service Service { get; set; }

        public List<CompletedOrderImage> Images { get; set; } // Промежуточная таблица для изображений
    }

}
