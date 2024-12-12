using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class CompletedOrderImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } // URL изображения

        public int CompletedOrderId { get; set; }

        [JsonIgnore]
        public CompletedOrder? CompletedOrder { get; set; }
    }

}
