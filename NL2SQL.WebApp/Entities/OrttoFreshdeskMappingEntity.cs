using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("ortto_freshdesk_mapping")]
    public class OrttoFreshdeskMappingEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ortto_person_id")]
        public string OrttoPersonId { get; set; }

        [Column("freshdesk_contact_id")]
        public int FreshdeskContactId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
