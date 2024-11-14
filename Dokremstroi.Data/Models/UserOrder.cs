using Dokremstroi.Data.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class UserOrder
    {
        public int Id { get; set; }
        public decimal TotalCost { get; set; } // Общая стоимость заказа
        public DateTime OrderDate { get; set; } // Дата заказа
        public OrderStatus Status { get; set; } // Статус заказа

        // Связь с пользователем
        public int UserId { get; set; }
        public User User { get; set; }
        // Навигационные свойства
        public List<UserOrderService> UserOrderServices { get; set; } // Промежуточная таблица для связи с услугами
    }

}
