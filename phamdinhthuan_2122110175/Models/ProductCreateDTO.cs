namespace phamdinhthuan_2122110175.Models
{
    public class ProductCreateDTO
    {
        public string ProductName { get; set; }
        public string Image { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public int UserId { get; set; } // Người thao tác (thêm/sửa)
    }
}
