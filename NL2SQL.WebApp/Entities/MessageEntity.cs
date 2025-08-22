using System.ComponentModel.DataAnnotations.Schema;
using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Models
{
    [Table("message")]
    public class MessageEntity
    {
        [Column("id")] public int Id { get; set; }

        [Column("text")] public string? Text { get; set; }

        [Column("is_user")] public bool IsUser { get; set; }

        [Column("type")] public string Type { get; set; }

        [Column("previous_message_id")] public int? PreviousMessageId { get; set; } = null;

        [Column("text_query")] public string? CombinedQuery { get; set; } = null;

        [Column("related_questions")] public string? FollowUpQuestions { get; set; } = null;

        [Column("suggestions")] public string? Suggestions { get; set; } = null;

        [Column("created_at")] public DateTime CreatedAt { get; set; }

        [Column("chat_id")] public int ChatId { get; set; }

        [Column("chat")] public ChatEntity Chat { get; set; }

        [Column("sql_messages")] public List<SqlMessageEntity> SqlMessages { get; set; } = new();
    }
}
