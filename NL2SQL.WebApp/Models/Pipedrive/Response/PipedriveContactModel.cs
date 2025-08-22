using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Pipedrive.Response
{
    public class PipedriveContactModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("org_id")]
        public OrgId OrgId { get; set; }

        [JsonPropertyName("email")]
        public List<Email> Email { get; set; }

        [JsonPropertyName("phone")]
        public List<Phone> Phone { get; set; }

        [JsonPropertyName("visible_to")]
        public string? VisibleTo { get; set; }

        [JsonPropertyName("add_time")]
        public DateTime? AddTime { get; set; }

        [JsonPropertyName("update_time")]
        public DateTime? UpdateTime { get; set; }
    }

    public class OrgId
    {
        [JsonPropertyName("value")]
        public int? Value { get; set; }
    }

    public class Email
    {
        [JsonPropertyName("value")]
        public string Value { get; set; }

        [JsonPropertyName("primary")]
        public bool Primary { get; set; }
    }

    public class Phone
    {
        [JsonPropertyName("value")]
        public string Value { get; set; }

        [JsonPropertyName("primary")]
        public bool Primary { get; set; }
    }
}
