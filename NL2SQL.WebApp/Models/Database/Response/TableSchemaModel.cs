namespace NL2SQL.WebApp.Models.Database.Response
{
    public class TableSchemaModel
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<TableFieldModel> Fields { get; set; } = new();

        public List<ForeignKeyModel> ForeignKeys { get; set; } = new ();

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
