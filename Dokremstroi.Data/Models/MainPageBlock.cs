using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Models
{
    public class MainPageBlock
    {
        public int Id { get; set; }
        public string Title { get; set; } // Заголовок блока
        public string Content { get; set; } // Текстовое содержимое
        public string ImageUrl { get; set; } // Ссылка на изображение
        public int Order { get; set; } // Порядок отображения
    }
}
