using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("freshdesk_conversation")]
    public class FreshdeskConversationEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ticket_id")]
        public int? TicketId { get; set; }

        [Column("user_type")]
        public string? UserType { get; set; }

        [Column("from_id")]
        public int? FromId { get; set; }

        [Column("body")]
        public string? Body { get; set; }

        [Column("private")]
        public bool Private { get; set; }

        [Column("source")]
        public string? Source { get; set; }

        [Column("attachments")]
        public string Attachments { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("data")]
        public string? Data { get; set; }
    }
}
