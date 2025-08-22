using NL2SQL.WebApp.Entities.Enums;

namespace NL2SQL.WebApp.Models.Message.Request
{
    public class EditMessageModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int? PreviousMessageId { get; set; } = null;
        public string? CombinedQuery { get; set; } = null;
        public bool IsUser { get; set; }
        public ReactionType Reaction { get; set; }
        public int ChatId { get; set; }
    }
}
