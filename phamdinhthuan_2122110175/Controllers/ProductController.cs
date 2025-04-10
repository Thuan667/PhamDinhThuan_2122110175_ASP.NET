using Microsoft.AspNetCore.Mvc;
using phamdinhthuan_2122110175.Data;
using phamdinhthuan_2122110175.Models;

namespace phamdinhthuan_2122110175.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Product
        [HttpPost]
        public IActionResult Create([FromBody] ProductCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = new Product
            {
                ProductName = dto.ProductName,
                Image = dto.Image,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                BrandId = dto.BrandId,
                CreatedAt = DateTime.UtcNow,
                UserId = dto.UserId
            };

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok(product);
        }

        // GET: api/Product
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Where(p => p.DeletedAt == null)
                .ToList();

            return Ok(products);
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ProductCreateDTO dto)
        {
            var product = _context.Products.FirstOrDefault(p => p.ProductId == id);

            if (product == null)
                return NotFound("Product not found");

            product.ProductName = dto.ProductName;
            product.Image = dto.Image;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;
            product.BrandId = dto.BrandId;
            product.UpdatedAt = DateTime.UtcNow;
            product.UserId = dto.UserId;

            _context.SaveChanges();

            return Ok(product);
        }

        // DELETE: api/Product/5?userId=2
        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromQuery] int userId)
        {
            var product = _context.Products.FirstOrDefault(p => p.ProductId == id);

            if (product == null)
                return NotFound("Product not found");

            product.DeletedAt = DateTime.UtcNow;
            product.UserId = userId;

            _context.SaveChanges();

            return Ok(new { message = "Product marked as deleted." });
        }

    }
}
