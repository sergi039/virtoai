using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("apollo_contact")]
    public class ApolloContactEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("contact_id")]
        public string ContactId { get; set; }

        [Column("first_name")]
        public string? FirstName { get; set; }

        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("organization_name")]
        public string? OrganizationName { get; set; }

        [Column("organization_id")]
        public string? OrganizationId { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("linkedin_url")]
        public string? LinkedInUrl { get; set; }

        [Column("country")]
        public string? Country { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
