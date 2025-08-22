using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Freshdesk.Response
{
    public class AgentModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("contact")]
        public ContactInfoModel Contact { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
