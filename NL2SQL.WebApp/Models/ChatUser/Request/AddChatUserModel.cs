namespace NL2SQL.WebApp.Models.ChatUser.Request
{
    public class AddChatUserModel
    {
        public string UserId { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string? PhotoUrl { get; set; }

        public int ChatId { get; set; }
    }
}
