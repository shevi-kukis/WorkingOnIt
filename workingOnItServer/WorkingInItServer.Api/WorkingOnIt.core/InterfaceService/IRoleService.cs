using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;

namespace WorkingOnIt.Core.InterfaceService
{
    public interface IRoleService
    {
        public Task<IEnumerable<RoleDTO>> GetAllRoles();

        public Task<RoleDTO> GetRoleById(int id);

        public Task<RoleDTO> AddRole(RoleDTO role);
        public Task<RoleDTO> UpdateRole(int id, RoleDTO role);

        public Task<bool> DeleteRole(int id);
    }
}
