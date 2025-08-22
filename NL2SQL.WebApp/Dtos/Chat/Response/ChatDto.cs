using NL2SQL.WebApp.Dtos.ChatUser.Response;
using NL2SQL.WebApp.Dtos.Message.Response;

namespace NL2SQL.WebApp.Dtos.Chat.Response
{
    public class ChatDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string UserOwnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<MessageDto> Messages { get; set; } = new();
        public List<ChatUserDto> ChatUsers { get; set; } = new();
    }
}
