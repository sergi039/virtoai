using NL2SQL.WebApp.Entities.Enums;

namespace NL2SQL.WebApp.Models.Message.Request
{
    public class EditSqlMessageModel
    {
        public int Id { get; set; }

        public string? Sql { get; set; }

        public string Text { get; set; }

        public string Model { get; set; }

        public bool IsSyntaxError { get; set; }

        public string? ErrorMessage { get; set; }

        public ReactionType Reaction { get; set; }

        public int MessageId { get; set; }
    }
}
