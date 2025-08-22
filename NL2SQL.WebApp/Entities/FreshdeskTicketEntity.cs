using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("freshdesk_ticket")]
    public class FreshdeskTicketEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("ticket_id")]
        public int TicketId { get; set; }

        [Column("subject")]
        public string? Subject { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("status")]
        public int Status { get; set; }

        [Column("priority")]
        public int Priority { get; set; }

        [Column("source")]
        public int Source { get; set; }

        [Column("type")]
        public string? Type { get; set; }

        [Column("requester_id")]
        public long? RequesterId { get; set; }

        [Column("responder_id")]
        public int? ResponderId { get; set; }

        [Column("company_id")]
        public int? CompanyId { get; set; }

        [Column("group_id")]
        public int? GroupId { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("due_by")]
        public DateTime? DueBy { get; set; }

        [Column("fr_due_by")]
        public DateTime? FrDueBy { get; set; }

        [Column("fr_escalated")]
        public bool FrEscalated { get; set; }

        [Column("is_escalated")]
        public bool IsEscalated { get; set; }

        [Column("tags")]
        public string Tags { get; set; }

        [Column("spam")]
        public bool Spam { get; set; }

        [Column("custom_fields")]
        public string CustomFields { get; set; }

        [Column("data")]
        public string Data { get; set; }
    }
}
