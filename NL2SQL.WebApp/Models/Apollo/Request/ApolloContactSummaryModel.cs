namespace NL2SQL.WebApp.Models.Apollo.Request
{
    public class ApolloContactSummaryModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string OrganizationName { get; set; }
        public int? FreshdeskId { get; set; }
        public int? PipedriveId { get; set; }
    }
}
