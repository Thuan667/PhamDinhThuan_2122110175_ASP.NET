namespace phamdinhthuan_2122110175.Models
{
    public class OrderDto
    {
        public DateTime OrderDate { get; set; }
        public double TotalAmount { get; set; }
        public int UserId { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ShippingAddress { get; set; }

    }
}
