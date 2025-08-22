using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Freshdesk.Response
{
    public class TicketFieldModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("label")]
        public string Label { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }
    }
}
