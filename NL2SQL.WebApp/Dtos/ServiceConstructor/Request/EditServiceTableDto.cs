namespace NL2SQL.WebApp.Dtos.Service.Request
{
    public class EditServiceTableDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public int ServiceRegistryEntityId { get; set; }
    }
}
