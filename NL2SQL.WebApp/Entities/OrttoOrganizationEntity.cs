using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("ortto_organization")]
    public class OrttoOrganizationEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ortto_id")]
        public string? OrttoId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("data")]
        public string? Data { get; set; }
    }
}
