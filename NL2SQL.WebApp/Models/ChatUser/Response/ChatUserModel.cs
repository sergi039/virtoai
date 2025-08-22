namespace NL2SQL.WebApp.Models.ChatUser.Response
{
    public class ChatUserModel
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public int ChatId { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string? PhotoUrl { get; set; }

        public DateTime JoinedAt { get; set; }
    }
}
