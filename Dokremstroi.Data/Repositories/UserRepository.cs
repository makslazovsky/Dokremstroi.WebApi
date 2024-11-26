using Dokremstroi.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dokremstroi.Data.Repositories
{
    public class UserRepository : Repository<User>
    {
        public UserRepository(DokremstroiContext context) : base(context) { }

    }
}
