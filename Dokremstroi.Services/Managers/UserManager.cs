using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class UserManager : ManagerBase<User>
    {
        public UserManager(IRepository<User> repository) : base(repository) { }

        // Дополнительные методы для работы с пользователями, если потребуется
    }
}
