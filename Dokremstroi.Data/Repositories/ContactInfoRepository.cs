using Dokremstroi.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Repositories
{
    public class ContactInfoRepository : Repository<ContactInfo>
    {
        public ContactInfoRepository(DokremstroiContext context) : base(context) { }

    }
}
