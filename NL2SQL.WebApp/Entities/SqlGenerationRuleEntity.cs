using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("sql_generation_rule")]
    public class SqlGenerationRuleEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("text")]
        public string Text { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("service_table_id")]
        public int? ServiceTableId { get; set; }

        public ServiceTableEntity? ServiceTable { get; set; }

        public IList<ServiceTableImplicitRelationEntity> ServiceTableImplicitRelations { get; set; } = new List<ServiceTableImplicitRelationEntity>();
    }
}
