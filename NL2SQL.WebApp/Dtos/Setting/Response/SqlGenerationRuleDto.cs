namespace NL2SQL.WebApp.Dtos.Setting.Response
{
    public class SqlGenerationRuleDto
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? ServiceTableId { get; set; }
    }
}
