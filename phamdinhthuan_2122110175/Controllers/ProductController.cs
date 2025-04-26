using AutoMapper;
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

    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;  // Khai báo _mapper

        public ProductController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));  // Kiểm tra mapper không phải null
        }


        // POST: api/Product
        [HttpPost]
        public IActionResult Create([FromForm] ProductCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string imagePath = null;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                // Tạo tên file duy nhất
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine("D:\\ASP.NET\\frontend\\public\\img\\" + fileName);

                // Tạo thư mục nếu chưa tồn tại
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    dto.Image.CopyTo(stream);
                }

                // Cập nhật đường dẫn ảnh để frontend có thể truy cập
                imagePath = fileName; // Lưu đường dẫn này để frontend có thể truy cập
            }

            var product = new Product
            {
                ProductName = dto.ProductName,
                Image = imagePath, // Sử dụng đường dẫn ảnh đã lưu
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
        public IActionResult Update(int id, [FromForm] ProductCreateDTO dto)
        {
            // Lấy sản phẩm từ cơ sở dữ liệu theo id
            var product = _context.Products.FirstOrDefault(p => p.ProductId == id);

            // Nếu không tìm thấy sản phẩm
            if (product == null)
                return NotFound("Product not found");

            // Cập nhật các thông tin khác của sản phẩm
            product.ProductName = dto.ProductName;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;
            product.BrandId = dto.BrandId;
            product.UpdatedAt = DateTime.UtcNow;
            product.UserId = dto.UserId;

            // ✅ Nếu có ảnh mới, lưu ảnh và cập nhật lại đường dẫn
            if (dto.Image != null && dto.Image.Length > 0)
            {
                // Tạo tên file duy nhất cho ảnh mới
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);

                // Đường dẫn lưu ảnh trên server
                var filePath = Path.Combine("D:\\ASP.NET\\frontend\\public\\img\\"+ fileName);

                // Tạo thư mục nếu chưa tồn tại
                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                // Lưu ảnh vào file system
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    dto.Image.CopyTo(stream);
                }

                // Cập nhật lại đường dẫn ảnh trong DB
                product.Image = fileName;
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            _context.SaveChanges();

            // Trả về sản phẩm đã được cập nhật
            return Ok(product);
        }
        [HttpGet("GetProductByCategoryId/{categoryId}")]
        public async Task<ActionResult<List<ProductCreateDTO>>> GetProductByCategoryId(int categoryId)
        {
            // Lấy danh sách sản phẩm theo CategoryId
            var products = await _context.Products
                                         .Where(p => p.CategoryId == categoryId)
                                         .ToListAsync();

            // Nếu không tìm thấy sản phẩm, trả về một mảng rỗng thay vì NotFound
            if (products == null || !products.Any())
            {
                // Bạn có thể trả về mảng trống hoặc thông báo khác
                return Ok(new List<ProductDTO>());
            }

            // Chuyển đổi danh sách sản phẩm thành danh sách ProductCreateDTO
            var productDTOs = products.Select(p => new ProductDTO
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                Price = p.Price,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                UserId = p.UserId,
                Image = p.Image  // Ánh xạ tên file ảnh từ cơ sở dữ liệu
            }).ToList();

            // Trả về danh sách ProductCreateDTO
            return Ok(productDTOs);
        }



        // GET: api/Product/5
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            // Lấy sản phẩm từ cơ sở dữ liệu theo id
            var product = _context.Products
                                  .FirstOrDefault(p => p.ProductId == id && p.DeletedAt == null);

            // Nếu không tìm thấy sản phẩm, trả về NotFound
            if (product == null)
            {
                return NotFound("Sản phẩm không tồn tại.");
            }

            // Chuyển đổi thành DTO để trả về
            var productDTO = new ProductDTO
            {
                ProductName = product.ProductName,
                Price = product.Price,
                CategoryId = product.CategoryId,
                BrandId = product.BrandId,
                UserId = product.UserId,
                Image = product.Image  // Chỉ trả về tên file ảnh
            };

            // Trả về thông tin sản phẩm
            return Ok(productDTO);
        }

        // DELETE: api/Product/5?userId=2
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.ProductId == id);

            if (product == null)
                return NotFound("Product not found");

            _context.Products.Remove(product); // XÓA THẬT
            _context.SaveChanges();

            return Ok(new { message = "Product permanently deleted." });
        }



    }
}
