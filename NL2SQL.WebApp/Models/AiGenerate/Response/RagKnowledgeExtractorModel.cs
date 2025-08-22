using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.AiGenerate.Response
{
    public class RagKnowledgeExtractorModel
    {
        [JsonPropertyName("error")]
        public string? Error { get; set; }

        [JsonPropertyName("model")]
        public string? Model { get; set; }

        [JsonPropertyName("query")]
        public string? Query { get; set; }

        [JsonPropertyName("ddl")]
        public IList<string> Ddl { get; set; } = new List<string>();

        [JsonPropertyName("documentation")]
        public IList<string> Documentation { get; set; } = new List<string>();
    }
}
