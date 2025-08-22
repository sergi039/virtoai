namespace NL2SQL.WebApp.Models.Message.Request
{
    public class AddSqlMessageModel
    {
        public string? Sql { get; set; }
        public string Text { get; set; }
        public string Model { get; set; }
        public bool IsSyntaxError { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
