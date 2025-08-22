using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Apollo.Response
{
    public class ApolloPersonResponseModel
    {
        [JsonPropertyName("person")]
        public ApolloContactModel Person { get; set; }
    }
}
