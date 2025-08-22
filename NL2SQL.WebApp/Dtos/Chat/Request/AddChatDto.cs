using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Chat.Request
{
    public class AddChatDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        public string UserOwnerId { get; set; }
    }
}
