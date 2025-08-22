namespace NL2SQL.WebApp.Models.Service.Request
{
    public class AddServiceTableImplicitRelationModel
    {
        public int ServiceTableId { get; set; }
        public int RelatedServiceTableId { get; set; }
        public string PrimaryTableColumn { get; set; }
        public string RelatedTableColumn { get; set; }
        public string RelationType { get; set; }
        public int SqlGenerationRuleId { get; set; }
    }
}
