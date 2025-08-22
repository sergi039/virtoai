using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities
{
    [Table("service_table_field_context_menu_item")]
    public class ServiceTableFieldContextMenuItemEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("sort_order")]
        public int SortOrder { get; set; }

        [Column("service_table_field_id")]
        public int ServiceTableFieldId { get; set; }

        public ServiceTableFieldEntity ServiceTableField { get; set; }
    }
}
