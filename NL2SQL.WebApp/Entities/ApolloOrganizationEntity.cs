using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("apollo_organization")]
    public class ApolloOrganizationEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("organization_id")]
        public string OrganizationId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("website_url")]
        public string? WebsiteUrl { get; set; }

        [Column("industry")]
        public string? Industry { get; set; }

        [Column("size")]
        public string? Size { get; set; }

        [Column("country")]
        public string? Country { get; set; }

        [Column("linkedin_url")]
        public string? LinkedInUrl { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
