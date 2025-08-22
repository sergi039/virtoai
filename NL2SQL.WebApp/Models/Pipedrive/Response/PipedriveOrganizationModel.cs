using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Pipedrive.Response
{
    public class PipedriveOrganizationModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("address")]
        public string? Address { get; set; }

        [JsonPropertyName("visible_to")]
        public string? VisibleTo { get; set; }

        [JsonPropertyName("add_time")]
        public DateTime? AddTime { get; set; }

        [JsonPropertyName("update_time")]
        public DateTime? UpdateTime { get; set; }
    }
}
