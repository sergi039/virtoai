namespace NL2SQL.WebApp.Dtos.Service.Request
{
    public class AddServiceTableImplicitRelationDto
    {
        public int ServiceTableId { get; set; }
        public int RelatedServiceTableId { get; set; }
        public string PrimaryTableColumn { get; set; }
        public string RelatedTableColumn { get; set; }
        public string RelationType { get; set; }
        public int SqlGenerationRuleId { get; set; }
    }
}
