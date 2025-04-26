using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using phamdinhthuan_2122110175.Data;
using phamdinhthuan_2122110175.Models;

namespace phamdinhthuan_2122110175.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Brand
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandDTO>>> GetBrands()
        {
            var brands = await _context.Brands
                .Select(b => new BrandDTO
                {
                    BrandName = b.BrandName,
                    BrandId = b.BrandId
                })
                .ToListAsync();

            return Ok(brands);
        }

        // GET: api/Brand/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDTO>> GetBrand(int id)
        {
            var brand = await _context.Brands
                .Where(b => b.BrandId == id)
                .Select(b => new BrandDTO
                {
                    BrandName = b.BrandName,
                    BrandId = b.BrandId
                })
                .FirstOrDefaultAsync();

            if (brand == null)
            {
                return NotFound();
            }

            return Ok(brand);
        }

        // POST: api/Brand
        [HttpPost]
        public async Task<ActionResult<BrandDTO>> CreateBrand(BrandDTO dto)
        {
            var brand = new Brand
            {
                BrandName = dto.BrandName,
                BrandId = dto.BrandId
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            var result = new BrandDTO
            {
                BrandName = brand.BrandName
            };

            return CreatedAtAction(nameof(GetBrand), new { id = brand.BrandId }, result);
        }

        // PUT: api/Brand/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(int id, BrandDTO dto)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return NotFound();
            }

            brand.BrandName = dto.BrandName;

            _context.Entry(brand).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã cập nhật thành công" });
        }

        // DELETE: api/Brand/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return NotFound();
            }

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công" });
        }
    }
}
