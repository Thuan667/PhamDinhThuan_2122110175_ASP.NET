using Microsoft.EntityFrameworkCore;
using phamdinhthuan_2122110175.Models;

namespace phamdinhthuan_2122110175.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cart>()
      .HasMany(c => c.Items)
      .WithOne(i => i.Cart)
      .HasForeignKey(i => i.CartId)
      .IsRequired();

            modelBuilder.Entity<Cart>()
                .HasKey(c => c.CartId);

            modelBuilder.Entity<CartItem>()
                .HasKey(ci => ci.CartItemId);

            modelBuilder.Entity<CartItem>()
                .Property(ci => ci.Price)
                .HasPrecision(18, 2);
            // Đảm bảo các cột mới được thêm vào bảng
            modelBuilder.Entity<Order>()
                .Property(o => o.ReceiverName)
                .HasMaxLength(255)
                .IsRequired(false); // Nếu không yêu cầu

            modelBuilder.Entity<Order>()
                .Property(o => o.ReceiverPhone)
                .HasMaxLength(20)
                .IsRequired(false);

            modelBuilder.Entity<Order>()
                .Property(o => o.ShippingAddress)
                .HasMaxLength(500)
                .IsRequired(false);
        }
    }
}
