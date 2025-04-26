using System.Text.Json.Serialization;

namespace phamdinhthuan_2122110175.Models
{
    public class Order
    {
            public int OrderId { get; set; }
            public DateTime OrderDate { get; set; }
            public double TotalAmount { get; set; }
        // Thông tin giao hàng
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ShippingAddress { get; set; }
        // FK
        public int UserId { get; set; }
            public User User { get; set; }
        [JsonIgnore]
        public ICollection<OrderDetail> OrderDetails { get; set; }

    }

}
