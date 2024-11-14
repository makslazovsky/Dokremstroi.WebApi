using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }  // Для безопасности лучше использовать хеш пароля
        public string Role { get; set; }  // Например, "Admin" или "Client"

        // Связь с заказами пользователя
        public ICollection<UserOrder>? Orders { get; set; }
    }
}
