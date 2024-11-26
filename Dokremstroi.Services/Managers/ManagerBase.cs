using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class ManagerBase<T> : IManager<T> where T : class
    {
        protected readonly IRepository<T> _repository;

        public ManagerBase(IRepository<T> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task AddAsync(T entity)
        {
            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(T entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<T> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _repository.FindAsync(predicate);
        }
    }
}
