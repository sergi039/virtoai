using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Message.Request
{
    public class EditMessageDto
    {
        [Required(ErrorMessage = "Id is required")]
        public int Id { get; set; }

        public string Text { get; set; }

        public int? PreviousMessageId { get; set; } = null;

        public string? CombinedQuery { get; set; } = null;

        [Required(ErrorMessage = "IsUser is required")]
        public bool IsUser { get; set; }

        [Required(ErrorMessage = "ChatId is required")]
        public int ChatId { get; set; }

        public IList<EditSqlMessageDto> SqlMessages { get; set; } = new List<EditSqlMessageDto>();
    }
}
