using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Ortto.Response
{
    public class OrttoOrganizationModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("fields")]
        public Dictionary<string, string> Field { get; set; }

        public string Name => Field?.GetValueOrDefault("str:o:name");
        public int? Employees => Field?.GetValueOrDefault("int:o:employees") != null ? int.Parse(Field["int:o:employees"]) : null;
        public string Industry => Field?.GetValueOrDefault("str:o:industry");
    }
}
