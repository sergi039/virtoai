using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("pipedrive_organization")]
    public class PipedriveOrganizationEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("organization_id")]
        public int OrganizationId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("people_count")]
        public int? PeopleCount { get; set; }

        [Column("won_deals_count")]
        public int? WonDealsCount { get; set; }

        [Column("lost_deals_count")]
        public int? LostDealsCount { get; set; }

        [Column("owner_name")]
        public string? OwnerName { get; set; }

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
