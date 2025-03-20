using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceRepository;

namespace WorkingOnIt.Data.Repository
{
    public class RepositoryGeneric<T> : IRepositoryGeneric<T> where T : class
    {
        protected readonly DbSet<T> _dbSet;

        public RepositoryGeneric(DataContext context)
        {
            _dbSet = context.Set<T>();
        }

        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            T entity = await _dbSet.FindAsync(id);
            if (entity == null) return false;
            _dbSet.Remove(entity);
            return true;
        }

        public async Task<List<T>> GetAsync()
        {
            return await _dbSet.ToListAsync();
        }
        
        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> UpdateAsync(int id, T entity)
        {
            T myentity = await _dbSet.FindAsync(id);
            if (myentity != null)
            {
                Type entityType = typeof(T);
                PropertyInfo[] propertyInfos = entityType.GetProperties();
                foreach (PropertyInfo propertyInfo in propertyInfos)
                {
                    PropertyInfo property = entityType.GetProperty(propertyInfo.Name);
                    if (property != null)
                    {
                        object value = property.GetValue(entity);
                        if (value != null && property.Name != "Id" && property.Name != "PasswordHash")
                        {
                            property.SetValue(myentity, value);
                        }
                    }
                }
                // _dbSet.Update(entity); // אם ברצונך לעדכן באופן מפורש
            }
            return entity;
        }
    }
}
