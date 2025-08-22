using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoActivityResponse
    {
        [JsonPropertyName("activities")]
        public List<OrttoActivityModel> Activities { get; set; }
    }
}
