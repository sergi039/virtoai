namespace NL2SQL.WebApp.Models.Service.Response
{
    public class ServiceTableModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public int ServiceRegistryEntityId { get; set; }

        public IList<ServiceTableFieldModel> TableFields { get; set; }

        public IList<ServiceTableImplicitRelationModel> ImplicitRelationsAsPrimary { get; set; }
    }
}
