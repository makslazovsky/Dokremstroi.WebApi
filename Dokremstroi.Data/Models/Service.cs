namespace Dokremstroi.Data.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Unit { get; set; } // Единица измерения
        public string GroupName { get; set; } // Группа услуг

        // Навигационное свойство
        public List<UserOrderService>? UserOrderServices { get; set; }
    }
}
