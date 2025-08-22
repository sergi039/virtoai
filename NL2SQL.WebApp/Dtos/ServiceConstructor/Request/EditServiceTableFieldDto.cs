namespace NL2SQL.WebApp.Dtos.Service.Request
{
    public class EditServiceTableFieldDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool IsHidden { get; set; }

        public bool IsAiContextGenerationEnabled { get; set; }

        public string UrlTemplate { get; set; }
    }
}
