using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Freshdesk.Response
{
    public class TicketModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("subject")]
        public string? Subject { get; set; }

        [JsonPropertyName("description_text")]
        public string? Description { get; set; }

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("priority")]
        public int Priority { get; set; }

        [JsonPropertyName("source")]
        public int Source { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("requester_id")]
        public long? RequesterId { get; set; }

        [JsonPropertyName("responder_id")]
        public int? ResponderId { get; set; }

        [JsonPropertyName("company_id")]
        public int? CompanyId { get; set; }

        [JsonPropertyName("group_id")]
        public int? GroupId { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [JsonPropertyName("due_by")]
        public DateTime? DueBy { get; set; }

        [JsonPropertyName("fr_due_by")]
        public DateTime? FrDueBy { get; set; }

        [JsonPropertyName("fr_escalated")]
        public bool FrEscalated { get; set; }

        [JsonPropertyName("is_escalated")]
        public bool IsEscalated { get; set; }

        [JsonPropertyName("tags")]
        public string[] Tags { get; set; }

        [JsonPropertyName("spam")]
        public bool Spam { get; set; }

        [JsonPropertyName("custom_fields")]
        public Dictionary<string, object> CustomFields { get; set; }
    }
}
