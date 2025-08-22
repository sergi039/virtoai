using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("service_table_implicit_relation")]
    public class ServiceTableImplicitRelationEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("service_table_id")]
        public int ServiceTableId { get; set; }

        public ServiceTableEntity ServiceTable { get; set; }

        [Column("related_service_table_id")]
        public int RelatedServiceTableId { get; set; }

        public ServiceTableEntity RelatedServiceTable { get; set; }

        [Column("primary_table_column")]
        public string PrimaryTableColumn { get; set; }

        [Column("related_table_column")]
        public string RelatedTableColumn { get; set; }

        [Column("relation_type")]
        public string RelationType { get; set; } 

        [Column("sql_generation_rule_id")]
        public int SqlGenerationRuleId { get; set; }

        public SqlGenerationRuleEntity SqlGenerationRule { get; set; }
    }
}
