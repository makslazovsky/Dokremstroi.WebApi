using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.DTO
{
    public class UserOrderDto
    {
        public int Id { get; set; }
        public decimal TotalCost { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public List<UserOrderServiceDto>? UserOrderServices { get; set; }
    }

    public class UserOrderServiceDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public decimal Quantity { get; set; }
    }

}
