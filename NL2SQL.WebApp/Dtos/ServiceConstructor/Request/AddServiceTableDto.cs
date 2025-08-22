namespace NL2SQL.WebApp.Dtos.Service.Request
{
    public class AddServiceTableDto
    {
        public string Name { get; set; }

        public bool IsActive { get; set; } = true;

        public int ServiceRegistryEntityId { get; set; }
    }
}
