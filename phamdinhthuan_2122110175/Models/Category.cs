namespace phamdinhthuan_2122110175.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        // Quan hệ 1-N với Product
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
