using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("pipedrive_freshdesk_contact")]
    public class PipedriveFreshdeskContactEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("pipedrive_contact_id")]
        public int PipedriveContactId { get; set; }

        [Column("freshdesk_contact_id")]
        public int FreshdeskContactId { get; set; }

        [Column("match_confidence")]
        public float MatchConfidence { get; set; }

        [Column("match_method")]
        public string MatchMethod { get; set; }

        [Column("matched_at")]
        public DateTime MatchedAt { get; set; }
    }
}
