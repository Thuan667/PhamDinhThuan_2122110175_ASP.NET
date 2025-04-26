using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace phamdinhthuan_2122110175.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Tự động tăng
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        // Quan hệ 1-N với Product
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
