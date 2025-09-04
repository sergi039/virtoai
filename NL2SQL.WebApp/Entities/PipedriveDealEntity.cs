using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("pipedrive_deal")]
    public class PipedriveDealEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("deal_id")]
        public int DealId { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("org_id")]
        public int? OrgId { get; set; }

        [Column("person_id")]
        public int? PersonId { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("value")]
        public decimal? Value { get; set; }

        [Column("active")]
        public bool Active { get; set; }

        [Column("formatted_weighted_value")]
        public string? FormattedWeightedValue { get; set; }

        [Column("products_count")]
        public int? ProductsCount { get; set; }

        [Column("currency")]
        public string Currency { get; set; }

        [Column("add_time")]
        public DateTime? AddTime { get; set; }

        [Column("update_time")]
        public DateTime? UpdateTime { get; set; }

        [Column("close_time")]
        public DateTime? CloseTime { get; set; }

        [Column("pipeline_id")]
        public int? PipelineId { get; set; }

        [Column("stage_id")]
        public int? StageId { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
