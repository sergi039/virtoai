namespace NL2SQL.WebApp.Models.Service.Request
{
    public class EditServiceTableFieldModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool IsHidden { get; set; }

        public bool IsAiContextGenerationEnabled { get; set; } = true;

        public string UrlTemplate { get; set; }
    }
}
