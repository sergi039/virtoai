using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Pipedrive.Response
{
    public class PipedriveActivityModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("subject")]
        public string Subject { get; set; }

        [JsonPropertyName("note")]
        public string Note { get; set; }

        [JsonPropertyName("due_date")]
        public DateTime? DueDate { get; set; }

        [JsonPropertyName("due_time")]
        public string DueTime { get; set; }

        [JsonPropertyName("duration")]
        public string Duration { get; set; }

        [JsonPropertyName("org_id")]
        public int? OrgId { get; set; }

        [JsonPropertyName("person_id")]
        public int? PersonId { get; set; }

        [JsonPropertyName("deal_id")]
        public int? DealId { get; set; }

        [JsonPropertyName("add_time")]
        public DateTime? AddTime { get; set; }

        [JsonPropertyName("update_time")]
        public DateTime? UpdateTime { get; set; }
    }
}
