namespace NL2SQL.WebApp.Models.Setting.Response
{
    public class ApolloSettingModel
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
        public bool Setup { get; set; }
        public string? Domain { get; set; }
        public string? EmailDomain { get; set; }
        public string? NameUser { get; set; }
        public int Limit { get; set; }
        public bool MatchFreshdesk { get; set; }
        public bool MatchPipedrive { get; set; }
    }
}
