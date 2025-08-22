using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoPersonResponse
    {
        [JsonPropertyName("contacts")]
        public List<OrttoPersonModel> Contacts { get; set; }

        [JsonPropertyName("cursor_id")]
        public string CursorId { get; set; }
    }
}
