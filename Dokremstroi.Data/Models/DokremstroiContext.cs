using Microsoft.EntityFrameworkCore;

namespace Dokremstroi.Data.Models
{
    //Add-Migration Init -StartupProject "Dokremstroi.Server" -Project "Dokremstroi.Data"

    public class DokremstroiContext : DbContext
    {
        public DokremstroiContext(DbContextOptions<DokremstroiContext> options) : base(options) { }

        public DbSet<Service> Services { get; set; }
        public DbSet<CompletedOrder> CompletedOrders { get; set; }
        public DbSet<UserOrder> UserOrders { get; set; }
        public DbSet<UserOrderService> UserOrderServices { get; set; } // Промежуточная таблица
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<CompletedOrderImage> CompletedOrderImages { get; set; } // Добавлен DbSet для изображений завершенных заказов

        public DbSet<MainPageBlock> MainPageBlocks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<UserOrder>()
               .HasOne(uos => uos.User)
               .WithMany(uo => uo.Orders)
               .HasForeignKey(uos => uos.UserId);

            modelBuilder.Entity<UserOrderService>()
             .Property(uos => uos.Id)
             .ValueGeneratedOnAdd();

            modelBuilder.Entity<UserOrderService>()
                .HasOne(uos => uos.UserOrder)
                .WithMany(uo => uo.UserOrderServices)
                .HasForeignKey(uos => uos.UserOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserOrderService>()
                .HasOne(uos => uos.Service)
                .WithMany(s => s.UserOrderServices)
                .HasForeignKey(uos => uos.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
