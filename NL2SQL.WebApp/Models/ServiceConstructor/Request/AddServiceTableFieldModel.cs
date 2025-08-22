namespace NL2SQL.WebApp.Models.Service.Request
{
    public class AddServiceTableFieldModel
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool IsHidden { get; set; }

        public string UrlTemplate { get; set; }

        public bool IsAiContextGenerationEnabled { get; set; } = true;

        public int ServiceTableId { get; set; }
    }
}
