using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoActivityModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("attr")]
        public OrttoAttributeModel Attribute { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
    }
}
