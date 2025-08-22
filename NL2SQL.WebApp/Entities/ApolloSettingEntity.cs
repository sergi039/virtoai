using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("apollo_setting")]
    public class ApolloSettingEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [Column("tables")]
        public string Tables { get; set; }

        [Column("api_key")]
        public string? ApiKey { get; set; }

        [Column("api_url")]
        public string? ApiUrl { get; set; }

        [Column("sync_duration")]
        public int SyncDuration { get; set; }

        [Column("sync_unit")]
        public string SyncUnit { get; set; }

        [Column("setup")]
        public bool Setup { get; set; }

        [Column("domain")]
        public string? Domain { get; set; }

        [Column("email_domain")]
        public string? EmailDomain { get; set; }

        [Column("name_user")]
        public string? NameUser { get; set; }

        [Column("limit")]
        public int Limit { get; set; } = 50;

        [Column("match_freshdesk")]
        public bool MatchFreshdesk { get; set; }

        [Column("match_pipedrive")]
        public bool MatchPipedrive { get; set; }

        [Column("last_sync_time")]
        public DateTime? LastSyncTime { get; set; }

        [Column("last_sync_count")]
        public int LastSyncCount { get; set; }
    }
}
