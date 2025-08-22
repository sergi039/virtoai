using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("freshdesk_contact")]
    public class FreshdeskContactEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("contact_id")]
        public int ContactId { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("job_title")]
        public string? JobTitle { get; set; }

        [Column("company_id")]
        public int? CompanyId { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
