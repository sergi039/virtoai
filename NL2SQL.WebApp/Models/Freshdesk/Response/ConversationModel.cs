using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Freshdesk.Response
{
    public class ConversationModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("ticket_id")]
        public int? TicketId { get; set; }

        [JsonPropertyName("user_id")]
        public int? UserId { get; set; }

        [JsonPropertyName("is_agent")]
        public bool IsAgent { get; set; }

        [JsonPropertyName("body")]
        public string Body { get; set; }

        [JsonPropertyName("private")]
        public bool Private { get; set; }

        [JsonPropertyName("source")]
        public string Source { get; set; }

        [JsonPropertyName("attachments")]
        public object[] Attachments { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
