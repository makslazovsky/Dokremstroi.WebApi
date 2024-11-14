using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class CompletedOrderManager : ManagerBase<CompletedOrder>
    {
        public CompletedOrderManager(IRepository<CompletedOrder> repository) : base(repository) { }
    }
}
