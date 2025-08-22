namespace NL2SQL.WebApp.Models.Freshdesk.Request
{
    public class FreshdeskImportStatsModel
    {
        public bool IsImporting { get; set; } = false;
        public int TotalRecords { get; set; }
    }
}
