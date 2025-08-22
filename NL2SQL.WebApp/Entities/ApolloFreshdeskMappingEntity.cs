using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("apollo_freshdesk_mapping")]
    public class ApolloFreshdeskMappingEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("apollo_id")]
        public string ApolloId { get; set; }

        [Column("freshdesk_id")]
        public int FreshdeskId { get; set; }

        [Column("match_method")]
        public string MatchMethod { get; set; }

        [Column("confidence")]
        public float Confidence { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
