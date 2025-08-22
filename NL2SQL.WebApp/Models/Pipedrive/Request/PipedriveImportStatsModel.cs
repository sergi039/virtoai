namespace NL2SQL.WebApp.Models.Pipedrive.Request
{
    public class PipedriveImportStatsModel
    {
        public bool IsImporting { get; set; } = false;
        public int Organizations { get; set; }
        public int Contacts { get; set; }
        public int Deals { get; set; }
        public int Activities { get; set; }
        public int Matches { get; set; }
        public int TotalRecords { get; set; }
        public Dictionary<string, int> EntityCounts { get; set; }
    }
}
