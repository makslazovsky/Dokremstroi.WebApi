using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Repositories
{
    public class ServiceRepository : Repository<Service>
    {
        public ServiceRepository(DokremstroiContext context) : base(context) { }

    }
}
