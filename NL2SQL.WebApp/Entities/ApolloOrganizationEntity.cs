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

        [Column("country")]
        public string? Country { get; set; }

        [Column("city")]
        public string? City { get; set; }

        [Column("linkedin_url")]
        public string? LinkedInUrl { get; set; }

        [Column("logo_url")]
        public string? LogoUrl { get; set; }

        [Column("short_description")]
        public string? Description { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
