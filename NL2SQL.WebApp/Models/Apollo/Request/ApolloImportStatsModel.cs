namespace NL2SQL.WebApp.Models.Apollo.Request
{
    public class ApolloImportStatsModel
    {
        public bool IsImporting { get; set; } = false;
        public int ContactsImported { get; set; }
        public int OrganizationsImported { get; set; }
        public int FreshdeskMatches { get; set; }
        public int PipedriveMatches { get; set; }
        public int TotalRecords { get; set; }
        public Dictionary<string, int> Counts { get; set; }
        public ApolloContactSummaryModel[] ExampleContacts { get; set; }
    }
}
