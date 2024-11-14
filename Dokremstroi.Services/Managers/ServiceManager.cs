using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Services.Managers
{
    public class ServiceManager : ManagerBase<Service>
    {
        public ServiceManager(IRepository<Service> repository) : base(repository) { }

    }
}
