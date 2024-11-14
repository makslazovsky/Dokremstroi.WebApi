using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class ContactInfo
    {
        public int Id { get; set; }
        public string Address { get; set; } // Адрес компании
        public string PhoneNumber { get; set; } // Номер телефона
        public string Email { get; set; } // Адрес электронной почты
        public string MapLink { get; set; } // Ссылка на карту (например, Google Maps)
        public string BankDetails { get; set; } // Банковские реквизиты
    }
}
