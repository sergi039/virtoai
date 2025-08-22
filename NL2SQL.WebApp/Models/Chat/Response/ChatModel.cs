using NL2SQL.WebApp.Models.ChatUser.Response;
using NL2SQL.WebApp.Models.Message.Response;

namespace NL2SQL.WebApp.Models.Chat.Response
{
    public class ChatModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string UserOwnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<MessageModel> Messages { get; set; } = new();
        public List<ChatUserModel> ChatUsers { get; set; } = new();
    }
}
