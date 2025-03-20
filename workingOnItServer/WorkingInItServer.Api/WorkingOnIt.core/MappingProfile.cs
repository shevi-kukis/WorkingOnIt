using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.ModalsDto;

namespace WorkingOnIt.Core
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Resume, ResumeDto>().ReverseMap();
            CreateMap<Interview, InterviewDto>().ReverseMap();
            CreateMap<InterviewQuestion, InterviewDto>().ReverseMap();
            CreateMap<Manager, ManagerDto>().ReverseMap();
            CreateMap<UserDto, UserUpdateDto>().ReverseMap(); // מיפוי בין UserDto ל-UserUpdateDto

            CreateMap<UserRegisterDto, User>()
    .ForMember(dest => dest.Resume, opt => opt.Ignore()); // הקובץ יטופל בנפרד

        }
    }
}
