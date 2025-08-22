using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Chat.Request
{
    public class EditChatDto
    {
        [Required(ErrorMessage = "Id is required")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "UpdatedAt is required")]
        public DateTime UpdatedAt { get; set; }
    }
}
