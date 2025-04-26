using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using phamdinhthuan_2122110175.Models;
using phamdinhthuan_2122110175.Data;
using Microsoft.AspNetCore.Authorization;
namespace phamdinhthuan_2122110175.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDTO
                {
                    CategoryId = c.CategoryId, // <-- THÊM DÒNG NÀY
                    CategoryName = c.CategoryName
                })
                .ToListAsync();

            return Ok(categories);
        }



        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            var category = await _context.Categories
                .Where(c => c.CategoryId == id)
                .Select(c => new CategoryDTO
                {
                    CategoryId = c.CategoryId, // <-- THÊM DÒNG NÀY
                    CategoryName = c.CategoryName
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }



        // POST: api/Category
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> CreateCategory(CategoryDTO dto)
        {
            var category = new Category
            {
                CategoryName = dto.CategoryName
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var result = new CategoryDTO
            {
                CategoryId = category.CategoryId, // <-- THÊM DÒNG NÀY
                CategoryName = category.CategoryName
            };

            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, result);
        }


        // PUT: api/Category/5
        // PUT: api/Category/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryDTO dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Cập nhật thông tin của category
            category.CategoryName = dto.CategoryName;

            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok("Đã cập nhật thành công");
        }




        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Xóa category
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            // Trả về thông báo "Xóa thành công"
            return Ok(new { message = "Xóa thành công", categoryId = category.CategoryId });
        }

    }
}
