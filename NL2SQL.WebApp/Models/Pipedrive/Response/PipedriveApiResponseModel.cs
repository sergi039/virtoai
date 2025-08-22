using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Pipedrive.Response
{
    public class PipedriveApiResponseModel<T>
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("data")]
        public List<T> Data { get; set; }

        [JsonPropertyName("additional_data")]
        public PipedriveAdditionalDataModel AdditionalData { get; set; }

        [JsonPropertyName("error")]
        public string Error { get; set; }
    }

    public class PipedriveAdditionalDataModel
    {
        [JsonPropertyName("pagination")]
        public PipedrivePaginationModel Pagination { get; set; }
    }

    public class PipedrivePaginationModel
    {
        [JsonPropertyName("more_items_in_collection")]
        public bool MoreItemsInCollection { get; set; }
    }
}
