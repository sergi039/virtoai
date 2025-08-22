using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Dtos.Database.Response
{
    public class TableFieldDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("isRequired")]
        public bool IsRequired { get; set; }

        [JsonPropertyName("isPrimaryKey")]
        public bool IsPrimaryKey { get; set; }

        [JsonPropertyName("isUnique")]
        public bool IsUnique { get; set; }

        [JsonPropertyName("defaultValue")]
        public string? DefaultValue { get; set; }

        [JsonPropertyName("maxLength")]
        public int? MaxLength { get; set; }

        [JsonPropertyName("precision")]
        public int? Precision { get; set; }

        [JsonPropertyName("scale")]
        public int? Scale { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }
    }
}
