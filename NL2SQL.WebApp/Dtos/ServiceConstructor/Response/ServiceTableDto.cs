namespace NL2SQL.WebApp.Dtos.Service.Response
{
    public class ServiceTableDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public int ServiceRegistryEntityId { get; set; }

        public IList<ServiceTableFieldDto> TableFields { get; set; }

        public IList<ServiceTableImplicitRelationDto> ImplicitRelationsAsPrimary { get; set; }
    }
}
