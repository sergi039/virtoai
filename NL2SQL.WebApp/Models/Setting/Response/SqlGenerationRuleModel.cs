namespace NL2SQL.WebApp.Models.SqlGenerationRule.Response
{
    public class SqlGenerationRuleModel
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? ServiceTableId { get; set; }
    }
}
