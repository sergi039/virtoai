namespace NL2SQL.WebApp.Models.Setting.Request
{
    public class EditPipedriveSettingModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string? ApiKey { get; set; }
        public string? ApiUrl { get; set; }
        public IList<string> Tables { get; set; }
        public int SyncDuration { get; set; }
        public string SyncUnit { get; set; }
        public int Limit { get; set; }
        public bool Setup { get; set; }
        public bool Full { get; set; }
        public bool MatchFreshdesk { get; set; }
        public string Entities { get; set; }
    }
}
