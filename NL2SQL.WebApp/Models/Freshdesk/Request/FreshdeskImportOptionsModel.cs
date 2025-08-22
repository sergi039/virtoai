namespace NL2SQL.WebApp.Models.Freshdesk.Request
{
    public class FreshdeskImportOptionsModel
    {
        public string? ApiKey { get; set; }
        public string Entities { get; set; } = "all";
        public bool Conversations { get; set; }
        public string Since { get; set; }
        public string Until { get; set; }
        public int BatchSize { get; set; } = 100;
        public bool Insecure { get; set; }
        public int? TicketId { get; set; }
        public int ParallelThreads { get; set; } = 5;
    }
}
