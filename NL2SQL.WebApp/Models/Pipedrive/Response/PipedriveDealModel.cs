using System.Text.Json.Serialization;

namespace NL2SQL.WebApp.Models.Pipedrive.Response
{
    public class PipedriveDealModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("org_id")]
        public OrgId OrgId { get; set; }

        [JsonPropertyName("person_id")]
        public PersonId PersonId { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("value")]
        public decimal? Value { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; }

        [JsonPropertyName("add_time")]
        public DateTime? AddTime { get; set; }

        [JsonPropertyName("update_time")]
        public DateTime? UpdateTime { get; set; }

        [JsonPropertyName("close_time")]
        public DateTime? CloseTime { get; set; }

        [JsonPropertyName("active")]
        public bool Active { get; set; }

        [JsonPropertyName("formatted_weighted_value")]
        public string? FormattedWeightedValue { get; set; }

        [JsonPropertyName("products_count")]
        public int? ProductsCount { get; set; }

        [JsonPropertyName("pipeline_id")]
        public int? PipelineId { get; set; }

        [JsonPropertyName("stage_id")]
        public int? StageId { get; set; }
    }

    public class PersonId
    {
        [JsonPropertyName("value")]
        public int? Value { get; set; }
    }
}
