using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("freshdesk_company")]
    public class FreshdeskCompanyEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("company_id")]
        public int CompanyId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("domains")]
        public string Domains { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
