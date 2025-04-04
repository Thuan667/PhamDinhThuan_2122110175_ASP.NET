namespace phamdinhthuan_2122110175.Models
{
    public class Brand
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }

        // Quan hệ 1-N với Product
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
