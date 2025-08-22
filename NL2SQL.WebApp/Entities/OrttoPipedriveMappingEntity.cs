using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("ortto_pipedrive_mapping")]
    public class OrttoPipedriveMappingEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ortto_person_id")]
        public string OrttoPersonId { get; set; }

        [Column("pipedrive_contact_id")]
        public int PipedriveContactId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
