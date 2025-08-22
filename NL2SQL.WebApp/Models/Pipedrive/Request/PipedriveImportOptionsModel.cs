namespace NL2SQL.WebApp.Models.Pipedrive.Request
{
    public class PipedriveImportOptionsModel
    {
        public string? ApiKey { get; set; }
        public string? ApiUrl { get; set; }
        public int Limit { get; set; }
        public bool Setup { get; set; }
        public bool MatchFreshdesk { get; set; }
        public List<string> Entities { get; set; } = new List<string> { "all" };
    }
}
