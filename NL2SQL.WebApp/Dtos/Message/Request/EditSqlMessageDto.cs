using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Message.Request
{
    public class EditSqlMessageDto
    {
        [Required(ErrorMessage = "Id is required")]
        public int Id { get; set; }

        public string? Sql { get; set; }

        [Required(ErrorMessage = "Text is required")]
        public string Text { get; set; }

        public string Model { get; set; }

        public bool IsSyntaxError { get; set; }

        public string? ErrorMessage { get; set; }

        public string Reaction { get; set; }

        public int MessageId { get; set; }
    }
}
