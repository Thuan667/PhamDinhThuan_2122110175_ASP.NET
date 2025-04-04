namespace phamdinhthuan_2122110175.Models
{ 
    public class Product
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Image { get; set; }

        public double Price { get; set; }

        // Khóa ngoại  
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        // Khóa ngoại  
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
    }
}