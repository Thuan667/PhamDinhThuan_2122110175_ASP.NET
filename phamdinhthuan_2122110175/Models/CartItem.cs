namespace phamdinhthuan_2122110175.Models
{
    public class CartItem
    {
        public int CartItemId { get; set; }

        public int CartId { get; set; }

        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } // giá tại thời điểm thêm vào giỏ
        public Cart Cart { get; set; }
        // Thêm thuộc tính điều hướng để liên kết với Product
        public Product Product { get; set; }  // Liên kết với bảng Product

    }

}
