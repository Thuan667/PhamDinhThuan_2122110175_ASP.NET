namespace phamdinhthuan_2122110175.Models
{
    public class OrderWithDetailsDto
    {
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        // Thêm các trường giao hàng
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ShippingAddress { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; }
    }
}
