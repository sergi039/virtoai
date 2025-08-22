namespace NL2SQL.WebApp.Models.Database.Response
{
    public class TableFieldModel
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public bool IsRequired { get; set; }

        public bool IsPrimaryKey { get; set; }

        public bool IsUnique { get; set; }

        public string? DefaultValue { get; set; }

        public int? MaxLength { get; set; }

        public int? Precision { get; set; }

        public int? Scale { get; set; }

        public string? Description { get; set; }
    }
}
