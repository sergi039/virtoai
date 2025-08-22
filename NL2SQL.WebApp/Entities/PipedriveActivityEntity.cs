using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("pipedrive_activity")]
    public class PipedriveActivityEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("activity_id")]
        public int ActivityId { get; set; }

        [Column("type")]
        public string Type { get; set; }

        [Column("subject")]
        public string Subject { get; set; }

        [Column("note")]
        public string? Note { get; set; }

        [Column("due_date")]
        public DateTime? DueDate { get; set; }

        [Column("due_time")]
        public string? DueTime { get; set; }

        [Column("duration")]
        public string Duration { get; set; }

        [Column("org_id")]
        public int? OrgId { get; set; }

        [Column("person_id")]
        public int? PersonId { get; set; }

        [Column("deal_id")]
        public int? DealId { get; set; }

        [Column("add_time")]
        public DateTime? AddTime { get; set; }

        [Column("update_time")]
        public DateTime? UpdateTime { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
