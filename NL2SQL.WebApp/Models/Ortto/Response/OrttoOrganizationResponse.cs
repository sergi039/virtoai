using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoOrganizationResponse
    {
        [JsonPropertyName("organizations")]
        public List<OrttoOrganizationModel> Organizations { get; set; }

        [JsonPropertyName("cursor_id")]
        public string CursorId { get; set; }
    }
}
