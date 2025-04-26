

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using phamdinhthuan_2122110175.Data;
using phamdinhthuan_2122110175.Models;

namespace phamdinhthuan_2122110175.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders.Include(o => o.User).ToList();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = _context.Orders.Include(o => o.User).FirstOrDefault(o => o.OrderId == id);
            if (order == null) return NotFound("Order not found");
            return Ok(order);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetOrderByUserId(int userId)
        {
            var orders = _context.Orders
                .Where(o => o.UserId == userId)
                .ToList();

            return Ok(orders);
        }




        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] OrderDto dto)
        {
            var order = _context.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null) return NotFound("Order not found");

            // Cập nhật các trường cần thiết
            order.OrderDate = dto.OrderDate;
            order.TotalAmount = dto.TotalAmount;
            order.UserId = dto.UserId;
            order.ReceiverName = dto.ReceiverName;  // Cập nhật tên người nhận
            order.ReceiverPhone = dto.ReceiverPhone;  // Cập nhật số điện thoại
            order.ShippingAddress = dto.ShippingAddress;  // Cập nhật địa chỉ giao hàng

            // Lưu thay đổi vào cơ sở dữ liệu
            _context.SaveChanges();

            return Ok(order);  // Trả về đơn hàng đã cập nhật
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null)
                return NotFound("Order not found");

            // Lấy các chi tiết đơn hàng liên quan đến đơn hàng
            var orderDetails = _context.OrderDetails.Where(d => d.OrderId == id).ToList();

            // Xóa chi tiết đơn hàng trước
            _context.OrderDetails.RemoveRange(orderDetails);

            // Xóa đơn hàng
            _context.Orders.Remove(order);

            _context.SaveChanges();

            return Ok(new { message = "Order and its details deleted successfully." });
        }

        [HttpPost("with-details")]
        public IActionResult CreateOrderWithDetails([FromBody] OrderWithDetailsDto dto)
        {
            // Tạo đối tượng Order từ DTO
            var order = new Order
            {
                UserId = dto.UserId,
                OrderDate = dto.OrderDate,
                TotalAmount = dto.OrderDetails.Sum(d => d.Quantity * d.UnitPrice),

                // Gán thông tin giao hàng từ DTO
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,
                ShippingAddress = dto.ShippingAddress
            };

            // Lưu đơn hàng vào cơ sở dữ liệu trước để lấy OrderId
            _context.Orders.Add(order);
            _context.SaveChanges();

            // Gán OrderId cho các chi tiết đơn hàng (OrderDetails)
            foreach (var detail in dto.OrderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.OrderId,  // Gán OrderId cho OrderDetail
                    ProductId = detail.ProductId,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice
                };
                _context.OrderDetails.Add(orderDetail);  // Thêm chi tiết vào cơ sở dữ liệu
            }

            // Lưu các chi tiết đơn hàng vào cơ sở dữ liệu
            _context.SaveChanges();

            // Trả về thông tin đơn hàng (bao gồm OrderId và các OrderDetails)
            return Ok(new { OrderId = order.OrderId, OrderDetails = dto.OrderDetails });
        }
    }
    }