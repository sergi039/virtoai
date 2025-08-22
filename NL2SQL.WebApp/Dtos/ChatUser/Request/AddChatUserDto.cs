namespace NL2SQL.WebApp.Dtos.ChatUser.Request
{
    public class AddChatUserDto
    {
        public string UserId { get; set; }

        public int ChatId { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string? PhotoUrl { get; set; }

        public DateTime JoinedAt { get; set; }
    }
}
