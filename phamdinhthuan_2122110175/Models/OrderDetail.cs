namespace phamdinhthuan_2122110175.Models
{
    public class OrderDetail
    {
        public int OrderDetailId { get; set; }  // ID duy nhất cho chi tiết đơn hàng
        public int OrderId { get; set; }        // Liên kết với Order
        public Order Order { get; set; }        // Đối tượng Order (không phải khóa chính)
        public int ProductId { get; set; }      // Liên kết với sản phẩm
        public Product Product { get; set; }    // Đối tượng sản phẩm
        public int Quantity { get; set; }       // Số lượng
        public double UnitPrice { get; set; }   // Giá đơn vị của sản phẩm
    }
}
