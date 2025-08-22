using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Apollo.Response
{
    public class ApolloContactModel
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("first_name")]
        public string FirstName { get; set; }

        [JsonPropertyName("last_name")]
        public string LastName { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("phone_numbers")]
        public List<PhoneNumber> PhoneNumbers { get; set; }

        [JsonPropertyName("organization")]
        public ApolloOrganizationModel Organization { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("linkedin_url")]
        public string LinkedInUrl { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }

    public class PhoneNumber
    {
        [JsonPropertyName("value")]
        public string Value { get; set; }
    }
}
