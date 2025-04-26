using AutoMapper;

namespace phamdinhthuan_2122110175.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map từ Product sang ProductCreateDTO
            CreateMap<Product, ProductCreateDTO>();
        }
    }

}
