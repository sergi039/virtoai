using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Message.Request
{
    public class AddSqlMessageDto
    {
        public string? Sql { get; set; }

        [Required(ErrorMessage = "Text is required")]
        public string Text { get; set; }

        [Required(ErrorMessage = "Model is required")]
        public string Model { get; set; }

        public bool IsSyntaxError { get; set; }

        public string? ErrorMessage { get; set; }

        [Required(ErrorMessage = "CreatedAt is required")]
        public DateTime CreatedAt { get; set; }
    }
}
