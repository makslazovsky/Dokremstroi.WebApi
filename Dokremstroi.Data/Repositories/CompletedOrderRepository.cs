using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Repositories
{
    public class CompletedOrderRepository : Repository<CompletedOrder>
    {
        public CompletedOrderRepository(DokremstroiContext context) : base(context) { }

    }
}
