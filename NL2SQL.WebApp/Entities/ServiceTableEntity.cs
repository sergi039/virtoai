using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("service_table")]
    public class ServiceTableEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } 

        [Column("service_registry_id")]
        public int ServiceRegistryEntityId { get; set; }

        public ServiceRegistryEntity ServiceRegistryEntity { get; set; }

        public IList<SqlGenerationRuleEntity> SqlGenerationRules { get; set; } = new List<SqlGenerationRuleEntity>();

        public IList<ServiceTableFieldEntity> TableFields { get; set; } = new List<ServiceTableFieldEntity>();

        public IList<ServiceTableImplicitRelationEntity> ImplicitRelationsAsPrimary { get; set; } = new List<ServiceTableImplicitRelationEntity>();

        public IList<ServiceTableImplicitRelationEntity> ImplicitRelationsAsRelated { get; set; } = new List<ServiceTableImplicitRelationEntity>();
    }
}
