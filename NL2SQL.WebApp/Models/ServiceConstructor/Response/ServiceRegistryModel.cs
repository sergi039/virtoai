namespace NL2SQL.WebApp.Models.Service.Response
{
    public class ServiceRegistryModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public List<ServiceTableModel> ServiceTables { get; set; } = new();
    }
}
