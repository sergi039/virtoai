using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoAttributeModel
    {
        [JsonPropertyName("idt::c")]
        public string? IdtC { get; set; }

        [JsonPropertyName("idt::a")]
        public string? IdtA { get; set; }

        [JsonPropertyName("idt::jri")]
        public string? IdtJri { get; set; }

        [JsonPropertyName("str::cn")]
        public string? StrCn { get; set; }

        [JsonPropertyName("str::ct")]
        public string? StrCt { get; set; }

        [JsonPropertyName("str::pr")]
        public string? StrPr { get; set; }

        [JsonPropertyName("str::name")]
        public string? StrName { get; set; }

    }
}
