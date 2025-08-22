namespace NL2SQL.WebApp.Models.Apollo.Request
{
    public class ApolloImportOptionsModel
    {
        public string ApiKey { get; set; }
        public string ApiUrl { get; set; }
        public bool Setup { get; set; }
        public string? Domain { get; set; }
        public string? EmailDomain { get; set; }
        public string? NameUser { get; set; }
        public int Limit { get; set; } = 100;
        public bool MatchFreshdesk { get; set; }
        public bool MatchPipedrive { get; set; }
    }
}
