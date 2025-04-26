using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using phamdinhthuan_2122110175.Data;
using phamdinhthuan_2122110175.Models;

namespace phamdinhthuan_2122110175.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;


        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cart/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<CartDTO>>> GetCarts(int userId)
        {
            var carts = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Items)
                    .ThenInclude(ci => ci.Product) // Lấy thông tin sản phẩm
                .ToListAsync();

            if (carts == null || !carts.Any())
                return NotFound();

            return carts.Select(cart => new CartDTO
            {
                UserId = cart.UserId,
                Items = cart.Items.Select(i => new CartItemDTO
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.ProductName, // Lấy tên sản phẩm
                    Image = i.Product.Image,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    CartId = i.CartId,
                    CartItemId =i.CartItemId
                }).ToList()
            }).ToList();
        }



        // POST: api/Cart
        [HttpPost]
        public async Task<ActionResult> CreateCart(CartDTO dto)
        {
            // Tạo giỏ hàng mới
            var cart = new Cart
            {
                UserId = dto.UserId,
                Items = dto.Items.Select(i => new CartItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart created", cartId = cart.CartId });
        }



        // PUT: api/Cart/5
        [HttpPut("{cartId}")]
        public async Task<IActionResult> UpdateCart(int cartId, CartDTO dto)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.CartId == cartId);

            if (cart == null)
                return NotFound();

            // Clear old items
            _context.CartItems.RemoveRange(cart.Items);

            // Add new items
            cart.Items = dto.Items.Select(i => new CartItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                Price = i.Price
            }).ToList();

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart updated" });
        }


        // Xóa một sản phẩm trong giỏ hàng
        [HttpDelete("cart/{cartId}/item/{cartItemId}")]
        public async Task<IActionResult> DeleteCartItem(int cartId, int cartItemId)
        {
            // Tìm giỏ hàng dựa trên cartId
            var cart = await _context.Carts
                .Include(c => c.Items) // Bao gồm các sản phẩm trong giỏ hàng
                .FirstOrDefaultAsync(c => c.CartId == cartId);

            // Nếu không tìm thấy giỏ hàng
            if (cart == null)
            {
                return NotFound(new { message = "Cart not found" });
            }

            // Tìm sản phẩm trong giỏ hàng dựa trên cartItemId
            var cartItem = cart.Items.FirstOrDefault(i => i.CartItemId == cartItemId);

            // Nếu không tìm thấy sản phẩm trong giỏ hàng
            if (cartItem == null)
            {
                return NotFound(new { message = "Item not found in cart" });
            }

            // Xóa sản phẩm khỏi giỏ hàng
            _context.CartItems.Remove(cartItem);

            // Nếu giỏ hàng không còn sản phẩm nào sau khi xóa
            if (cart.Items.Count == 1)
            {
                // Xóa cả giỏ hàng (cartId)
                _context.Carts.Remove(cart);
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item and cart deleted successfully" });
        }
        // GET: api/Cart/count/5
        [HttpGet("count/{userId}")]
        public async Task<ActionResult<int>> GetCartCount(int userId)
        {
            // Đếm số lượng giỏ hàng của người dùng
            var cartCount = await _context.Carts
                .Where(c => c.UserId == userId)
                .CountAsync();

            return Ok(cartCount);
        }

    }
}

