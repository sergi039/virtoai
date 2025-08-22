using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class ServiceTableImplicitRelationRepository : Repository<ServiceTableImplicitRelationEntity>, IServiceTableImplicitRelationRepository
    {
        public ServiceTableImplicitRelationRepository(AppDbContext context) : base(context)
        {
        }
    }
}
