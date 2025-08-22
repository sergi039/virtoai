using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("apollo_pipedrive_mapping")]
    public class ApolloPipedriveMappingEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("apollo_id")]
        public string ApolloId { get; set; }

        [Column("pipedrive_id")]
        public int PipedriveId { get; set; }

        [Column("match_method")]
        public string MatchMethod { get; set; }

        [Column("confidence")]
        public float Confidence { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
