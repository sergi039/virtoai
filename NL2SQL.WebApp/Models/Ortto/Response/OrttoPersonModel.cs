using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoPersonModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("fields")]
        public Dictionary<string, string> Field { get; set; }

        public string? Email => Field?.GetValueOrDefault("str::email");
        public string? FirstName => Field?.GetValueOrDefault("str::first");
        public string? LastName => Field?.GetValueOrDefault("str::last");
    }
}
