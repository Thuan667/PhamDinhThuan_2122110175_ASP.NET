
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using phamdinhthuan_2122110175.Data;
using phamdinhthuan_2122110175.Models;

namespace phamdinhthuan_2122110175.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderDetailController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var details = _context.OrderDetails
                .Include(d => d.Order)
                .Include(d => d.Product)
                .ToList();
            return Ok(details);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var detail = _context.OrderDetails
                .Include(d => d.Order)
                .Include(d => d.Product)
                .FirstOrDefault(d => d.OrderDetailId == id);

            if (detail == null) return NotFound("Order detail not found");
            return Ok(detail);
        }
        [HttpGet("orderId/{orderId}")]
        public IActionResult GetOrderDetail(int orderId)
        {
            var orderDetails = _context.OrderDetails
                .Include(od => od.Order)         // Bao gồm thông tin đơn hàng
                .ThenInclude(o => o.User)        // Bao gồm thông tin người dùng của đơn hàng
                .Include(od => od.Product)       // Bao gồm thông tin sản phẩm
                .ThenInclude(p => p.Category)    // Bao gồm thông tin danh mục sản phẩm
                .Where(od => od.OrderId == orderId)
                .Select(od => new
                {
                    od.OrderDetailId,
                    od.Quantity,
                    od.UnitPrice,
                    Order = new
                    {
                        od.Order.OrderId,
                        od.Order.OrderDate,
                        od.Order.TotalAmount,
                        od.Order.ReceiverName,
                        od.Order.ReceiverPhone,
                        od.Order.ShippingAddress,
                        User = new
                        {
                            od.Order.User.UserId,
                            od.Order.User.Username
                        }
                    },
                    Product = new
                    {
                        od.Product.ProductId,
                        od.Product.ProductName,
                        od.Product.Image,
                        od.Product.Price,
                        Category = new
                        {
                            od.Product.Category.CategoryId,
                            od.Product.Category.CategoryName
                        },
                        Brand = new
                        {
                            od.Product.Brand.BrandId,
                            od.Product.Brand.BrandName
                        },
                        od.Product.CreatedAt,
                        od.Product.UpdatedAt,
                        od.Product.DeletedAt
                    }
                })
                .ToList();

            if (orderDetails == null || orderDetails.Count == 0)
                return NotFound("Order details not found");

            return Ok(orderDetails);
        }






        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] OrderDetailDto dto)
        {
            var detail = _context.OrderDetails.FirstOrDefault(d => d.OrderDetailId == id);
            if (detail == null) return NotFound("Order detail not found");

            detail.ProductId = dto.ProductId;
            detail.Quantity = dto.Quantity;
            detail.UnitPrice = dto.UnitPrice;

            _context.SaveChanges();
            return Ok(detail);
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var detail = _context.OrderDetails.FirstOrDefault(d => d.OrderDetailId == id);
            if (detail == null) return NotFound("Order detail not found");

            _context.OrderDetails.Remove(detail);
            _context.SaveChanges();
            return Ok(new { message = "Order detail deleted." });
        }
    }
}
        
