namespace NL2SQL.WebApp.Models.Service.Request
{
    public class EditServiceTableModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public int ServiceRegistryEntityId { get; set; }
    }
}
