using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Apollo.Response
{
    public class ApolloSearchResponseModel
    {
        [JsonPropertyName("people")]
        public List<ApolloContactModel> People { get; set; }
    }
}
