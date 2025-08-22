using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Dtos.Database.Response
{
    public class TableSchemaDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("fields")]
        public List<TableFieldDto> Fields { get; set; } = new();

        [JsonPropertyName("foreignKeys")]
        public List<ForeignKeyDto> ForeignKeys { get; set; } = new();

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}
