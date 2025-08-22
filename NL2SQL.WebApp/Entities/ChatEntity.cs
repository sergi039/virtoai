using System.ComponentModel.DataAnnotations.Schema;
using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Models
{
    [Table("chat")]
    public class ChatEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("user_owner_id")]
        public string UserOwnerId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public List<MessageEntity> Messages { get; set; } = new();

        public List<ChatUserEntity> ChatUsers { get; set; } = new();
    }
}
