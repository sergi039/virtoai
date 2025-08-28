using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("ortto_person")]
    public class OrttoPersonEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ortto_id")]
        public string? OrttoId { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("first_name")]
        public string? FirstName { get; set; }

        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("data")]
        public string Data { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
