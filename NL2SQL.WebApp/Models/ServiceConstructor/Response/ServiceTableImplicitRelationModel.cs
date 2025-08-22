namespace NL2SQL.WebApp.Models.Service.Response
{
    public class ServiceTableImplicitRelationModel
    {
        public int Id { get; set; }
        public int ServiceTableId { get; set; }
        public int RelatedServiceTableId { get; set; }
        public string PrimaryTableColumn { get; set; }
        public string RelatedTableColumn { get; set; }
        public string RelationType { get; set; }
        public int SqlGenerationRuleId { get; set; }
    }
}
