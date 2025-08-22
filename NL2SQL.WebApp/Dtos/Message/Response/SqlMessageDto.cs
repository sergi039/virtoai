using NL2SQL.WebApp.Entities.Enums;

namespace NL2SQL.WebApp.Dtos.Message.Response
{
    public class SqlMessageDto
    {
        public int Id { get; set; }
        public string? Sql { get; set; }
        public string Text { get; set; }
        public string Model { get; set; }
        public string Reaction { get; set; }
        public bool IsSyntaxError { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; }

        public int MessageId { get; set; }
    }
}
