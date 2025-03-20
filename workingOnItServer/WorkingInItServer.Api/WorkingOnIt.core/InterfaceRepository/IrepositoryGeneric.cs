using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace WorkingOnIt.Core.InterfaceRepository
{

    public interface IRepositoryGeneric<T> where T : class
    {








        public  Task<T> AddAsync(T entity);


        public  Task<bool> DeleteAsync(int id);


        public  Task<List<T>> GetAsync();


        public Task<T?> GetByIdAsync(int id);


        public  Task<T> UpdateAsync(int id, T entity);
     
        }
    }




