using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("service_table_field")]
    public class ServiceTableFieldEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("column_name")]
        public string Name { get; set; }

        [Column("display_name")]
        public string DisplayName { get; set; }

        [Column("is_hidden")]
        public bool IsHidden { get; set; }

        [Column("url_template")]
        public string? UrlTemplate { get; set; }

        [Column("service_table_id")]
        public int ServiceTableId { get; set; }

        [Column("is_ai_generate_context_enabled")]
        public bool IsAiContextGenerationEnabled { get; set; } = true;

        public ServiceTableEntity ServiceTable { get; set; }

        public IList<ServiceTableFieldContextMenuItemEntity> ContextMenuItems { get; set; } = new List<ServiceTableFieldContextMenuItemEntity>();
    }
}
