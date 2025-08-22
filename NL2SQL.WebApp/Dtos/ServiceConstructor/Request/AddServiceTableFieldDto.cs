namespace NL2SQL.WebApp.Dtos.Service.Request
{
    public class AddServiceTableFieldDto
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool IsHidden { get; set; }

        public string UrlTemplate { get; set; }

        public int ServiceTableId { get; set; }

        public bool IsAiContextGenerationEnabled { get; set; } = true;
    }
}
