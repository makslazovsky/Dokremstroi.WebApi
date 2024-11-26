using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public interface IUserManager : IManager<User>
    {
        Task<User?> GetByUsernameAsync(string username);
    }
}
