namespace NL2SQL.WebApp.Models.Message.Response
{
    public class MessageModel
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public bool IsUser { get; set; }
        public string Type { get; set; }
        public int? PreviousMessageId { get; set; }
        public string? CombinedQuery { get; set; }
        public string? Suggestions { get; set; } 
        public string? FollowUpQuestions { get; set; } 
        public DateTime CreatedAt { get; set; }
        public int ChatId { get; set; }

        public List<SqlMessageModel> SqlMessages { get; set; } = new();
    }
}
