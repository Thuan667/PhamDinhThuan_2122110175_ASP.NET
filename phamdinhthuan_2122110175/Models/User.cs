using System.Text.Json.Serialization;
namespace phamdinhthuan_2122110175.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string Role { get; set; } = "user";        //[JsonIgnore]
        //public ICollection<Order> Orders { get; set; }
    }
}
