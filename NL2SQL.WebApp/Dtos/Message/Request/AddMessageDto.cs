using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Message.Request
{
    public class AddMessageDto
    {
        public string? Text { get; set; }

        [Required(ErrorMessage = "Type is required")]
        public string Type { get; set; }

        public int? PreviousMessageId { get; set; } = null;

        public string? CombinedQuery { get; set; } = null;

        public string? Suggestions { get; set; } = null;

        public string? FollowUpQuestions { get; set; } = null;

        [Required(ErrorMessage = "IsUser is required")]
        public bool IsUser { get; set; }

        [Required(ErrorMessage = "CreatedAt is required")]
        public DateTime CreatedAt { get; set; }

        [Required(ErrorMessage = "ChatId is required")]
        public int ChatId { get; set; }

        public IList<AddSqlMessageDto> SqlMessages { get; set; } = new List<AddSqlMessageDto>();
    }
}
