using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("ortto_activity")]
    public class OrttoActivityEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ortto_id")]
        public string? OrttoId { get; set; }

        [Column("person_id")]
        public string? PersonId { get; set; }

        [Column("organization_id")]
        public string? OrganizationId { get; set; }

        [Column("activity_type")]
        public string? ActivityType { get; set; }

        [Column("activity_date")]
        public DateTime? ActivityDate { get; set; }

        [Column("data")]
        public string? Data { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
