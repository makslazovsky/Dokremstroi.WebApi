using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class UserManager : ManagerBase<User>, IUserManager
    {
        public UserManager(IRepository<User> repository) : base(repository)  { }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _repository.FindAsync(u => u.Username == username);
        }
    }
}
