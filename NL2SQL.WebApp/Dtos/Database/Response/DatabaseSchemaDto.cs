using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Dtos.Database.Response
{
    public class DatabaseSchemaDto
    {
        [JsonPropertyName("databaseName")]
        public string DatabaseName { get; set; } = string.Empty;

        [JsonPropertyName("tables")]
        public List<TableSchemaDto> Tables { get; set; } = new();

        [JsonPropertyName("lastUpdated")]
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
