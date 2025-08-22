using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("pipedrive_contact")]
    public class PipedriveContactEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("contact_id")]
        public int ContactId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("organization_id")]
        public int? OrganizationId { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("visible_to")]
        public string? VisibleTo { get; set; }

        [Column("add_time")]
        public DateTime? AddTime { get; set; }

        [Column("update_time")]
        public DateTime? UpdateTime { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
