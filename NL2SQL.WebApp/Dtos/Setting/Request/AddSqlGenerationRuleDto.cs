namespace NL2SQL.WebApp.Dtos.Setting.Request
{
    public class AddSqlGenerationRuleDto
    {
        public string Text { get; set; }

        public bool IsActive { get; set; }

        public int? ServiceTableId { get; set; }
    }
}
