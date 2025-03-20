using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingInIt.Api.ModalsDto;
using WorkingOnIt.Core.Dtos;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IAuthService
    {
        public Task<string> LoginAsync(UserLoginDto userLoginDto);


        public Task RegisterUserAsync(UserRegisterDto model);

        public Task<UserDto> GetByEmailAsync(string email);
    }
}
