using NL2SQL.WebApp.Models.ServiceConstructor.Response;

namespace NL2SQL.WebApp.Models.Service.Response
{
    public class ServiceTableFieldModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool IsHidden { get; set; }

        public string UrlTemplate { get; set; }

        public int ServiceTableId { get; set; }

        public bool IsAiContextGenerationEnabled { get; set; }

        public IList<FieldContextMenuItemModel> ContextMenuItems { get; set; }
    }
}
