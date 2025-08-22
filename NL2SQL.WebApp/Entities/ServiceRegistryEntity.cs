using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("service_registry")]
    public class ServiceRegistryEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        public List<ServiceTableEntity> ServiceTables { get; set; } = new();
    }
}
