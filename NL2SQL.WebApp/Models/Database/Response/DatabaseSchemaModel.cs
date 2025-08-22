namespace NL2SQL.WebApp.Models.Database.Response
{
    public class DatabaseSchemaModel
    {
        public string DatabaseName { get; set; } = string.Empty;

        public List<TableSchemaModel> Tables { get; set; } = new();

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
