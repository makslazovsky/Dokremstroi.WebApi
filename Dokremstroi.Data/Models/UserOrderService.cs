using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class UserOrderService
    {
        public int UserOrderId { get; set; }
        public UserOrder UserOrder { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; }
    }
}
