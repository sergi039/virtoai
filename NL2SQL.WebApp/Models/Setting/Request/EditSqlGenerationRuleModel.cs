namespace NL2SQL.WebApp.Models.Setting.Request
{
    public class EditSqlGenerationRuleModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsActive { get; set; }
        public int? ServiceTableId { get; set; }
    }
}
