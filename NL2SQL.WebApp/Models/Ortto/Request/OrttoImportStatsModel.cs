namespace NL2SQL.WebApp.Models.Ortto.Request
{
    public class OrttoImportStatsModel
    {
        public bool IsImporting { get; set; } = false;
        public int Persons { get; set; }
        public int Organizations { get; set; }
        public int Activities { get; set; }
        public int FreshdeskMatches { get; set; }
        public int PipedriveMatches { get; set; }
        public int TotalRecords { get; set; }
    }
}
