using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("freshdesk_setting")]
    public class FreshdeskSettingEntity
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

        [Column("entities")]
        public string Entities { get; set; } = "all";

        [Column("conversations")]
        public bool Conversations { get; set; }

        [Column("since")]
        public string Since { get; set; }

        [Column("until")]
        public string Until { get; set; }

        [Column("batch_size")]
        public int BatchSize { get; set; } = 100;

        [Column("insecure")]
        public bool Insecure { get; set; }

        [Column("ticket_id")]
        public int? TicketId { get; set; }

        [Column("parallel_threads")]
        public int ParallelThreads { get; set; } = 5;

        [Column("last_sync_time")]
        public DateTime? LastSyncTime { get; set; }

        [Column("last_sync_count")]
        public int LastSyncCount { get; set; }
    }
}
