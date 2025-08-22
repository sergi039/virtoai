using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Freshdesk.Response
{
    public class ContactInfoModel
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("phone")]
        public string Phone { get; set; }

        [JsonPropertyName("job_title")]
        public string JobTitle { get; set; }
    }
}
