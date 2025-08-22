namespace NL2SQL.WebApp.Dtos.Setting.Response
{
    public class FreshdeskSettingDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountRecords { get; set; }
        public bool IsActive { get; set; }
        public string? ApiKey { get; set; }
        public string? ApiUrl { get; set; }
        public IList<string> Tables { get; set; }
        public DateTime? LastSyncTime { get; set; }
        public int LastSyncCount { get; set; }
        public int SyncDuration { get; set; }
        public string SyncUnit { get; set; }
        public string Entities { get; set; }
        public bool Conversations { get; set; }
        public string Since { get; set; }
        public string Until { get; set; }
        public int BatchSize { get; set; }
        public bool Insecure { get; set; }
        public int? TicketId { get; set; }
        public int ParallelThreads { get; set; }
    }
}
