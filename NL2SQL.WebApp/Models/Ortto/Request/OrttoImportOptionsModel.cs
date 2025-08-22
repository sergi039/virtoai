namespace NL2SQL.WebApp.Models.Ortto.Request
{
    public class OrttoImportOptionsModel
    {
        public string? ApiKey { get; set; }
        public string? ApiUrl { get; set; }
        public bool Setup { get; set; }
        public bool ImportData { get; set; }
        public int Limit { get; set; }
        public bool MatchFreshdesk { get; set; }
        public bool MatchPipedrive { get; set; }
    }
}
