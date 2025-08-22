namespace NL2SQL.WebApp.Dtos.Setting.Request
{
    public class EditSqlGenerationRuleDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsActive { get; set; }
        public int? ServiceTableId { get; set; }
    }
}
