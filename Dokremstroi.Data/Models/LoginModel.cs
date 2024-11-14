using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class LoginModel
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }  // В реальном приложении передавайте хэш пароля
    }
}
