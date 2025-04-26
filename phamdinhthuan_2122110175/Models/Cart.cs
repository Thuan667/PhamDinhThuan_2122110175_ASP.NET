namespace phamdinhthuan_2122110175.Models
{
    public class Cart
    {
        public int CartId { get; set; }

        public int UserId { get; set; }
        public ICollection<CartItem> Items { get; set; }
    }

}
