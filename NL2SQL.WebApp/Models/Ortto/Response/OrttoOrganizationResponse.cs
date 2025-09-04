using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoOrganizationResponse
    {
        [JsonPropertyName("accounts")]
        public List<OrttoOrganizationModel> Accounts { get; set; }

        [JsonPropertyName("cursor_id")]
        public string CursorId { get; set; }
    }
}
