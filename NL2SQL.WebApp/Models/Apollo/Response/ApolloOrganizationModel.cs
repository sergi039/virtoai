using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Apollo.Response
{
    public class ApolloOrganizationModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("website_url")]
        public string WebsiteUrl { get; set; }

        [JsonPropertyName("industry")]
        public string Industry { get; set; }

        [JsonPropertyName("size")]
        public string Size { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }

        [JsonPropertyName("linkedin_url")]
        public string LinkedInUrl { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
