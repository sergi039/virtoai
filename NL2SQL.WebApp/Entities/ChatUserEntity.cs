using NL2SQL.WebApp.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("chat_user")]
    public class ChatUserEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }

        [Column("username")]
        public string Username { get; set; }

        [Column("email")] 
        public string Email { get; set; }

        [Column("photo_url")] 
        public string? PhotoUrl { get; set; }

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; }

        [Column("chat_id")]
        public int ChatId { get; set; }

        public ChatEntity Chat { get; set; }
    }
}
