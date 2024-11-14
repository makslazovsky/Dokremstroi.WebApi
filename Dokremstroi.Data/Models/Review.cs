using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Идентификатор пользователя
        public int ServiceId { get; set; } // Идентификатор услуги, к которой относится отзыв
        public string Comment { get; set; } // Текст отзыва
        public int Rating { get; set; } // Оценка по 5-балльной шкале
        public bool IsApproved { get; set; } // Признак, был ли отзыв подтвержден

        // Навигационные свойства
        public Service Service { get; set; }
    }
}
