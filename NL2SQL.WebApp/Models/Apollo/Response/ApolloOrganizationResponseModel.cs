using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Apollo.Response
{
    public class ApolloOrganizationResponseModel
    {
        [JsonPropertyName("organization")]
        public ApolloOrganizationModel Organization { get; set; }
    }
}
