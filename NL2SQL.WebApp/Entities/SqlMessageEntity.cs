using NL2SQL.WebApp.Entities.Enums;
using NL2SQL.WebApp.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("sql_message")]
    public class SqlMessageEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("sql")]
        public string? Sql { get; set; }

        [Column("text")]
        public string Text { get; set; }

        [Column("is_syntax_error")]
        public bool IsSyntaxError { get; set; } = false;

        [Column("error_message")]
        public string? ErrorMessage { get; set; }

        [Column("model")]
        public string Model { get; set; }

        [Column("reaction")]
        public ReactionType Reaction { get; set; } = ReactionType.None;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("message_id")]
        public int MessageId { get; set; }

        [Column("message")]
        public MessageEntity Message { get; set; }
    }
}
