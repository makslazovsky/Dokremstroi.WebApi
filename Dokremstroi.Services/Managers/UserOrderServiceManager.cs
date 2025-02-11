using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class UserOrderServiceManager : ManagerBase<UserOrderService>
    {
        public UserOrderServiceManager(IRepository<UserOrderService> repository) : base(repository) { }
    }
}
