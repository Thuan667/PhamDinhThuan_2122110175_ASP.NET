namespace phamdinhthuan_2122110175.Models
{
    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string ProductName { get; set; }
        public string Image { get; set; }
        public int CartId { get; set; }
        public int CartItemId { get; set; }

    }

}
