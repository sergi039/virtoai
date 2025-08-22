namespace NL2SQL.WebApp.Models.Service.Request
{
    public class AddServiceTableModel
    {
        public string Name { get; set; }

        public bool IsActive { get; set; }

        public int ServiceRegistryEntityId { get; set; }
    }
}
