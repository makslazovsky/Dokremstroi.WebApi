using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public interface IManager<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);

        Task<T> FindAsync(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> GetFilteredAsync(Expression<Func<T, bool>> predicate);

        Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
    Expression<Func<T, bool>> filter = null,
    Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
    int page = 1,
    int pageSize = 10);

    }
}
