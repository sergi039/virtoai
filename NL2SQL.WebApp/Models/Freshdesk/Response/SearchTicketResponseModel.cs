using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Freshdesk.Response
{
    public class SearchTicketResponseModel
    {
        [JsonPropertyName("results")]
        public List<TicketModel> Results { get; set; }

        [JsonPropertyName("total")]
        public int Total { get; set; }
    }
}
