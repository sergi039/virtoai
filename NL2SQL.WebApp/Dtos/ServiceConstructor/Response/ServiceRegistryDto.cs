namespace NL2SQL.WebApp.Dtos.Service.Response
{
    public class ServiceRegistryDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public List<ServiceTableDto> ServiceTables { get; set; } = new();
    }
}
