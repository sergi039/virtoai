namespace NL2SQL.WebApp.Models.AiGenerate.Response
{
    public class GenerateClarifyingModel
    {
        public string MainGeneratedQuery { get; set; }
        public List<string> Questions { get; set; }
        public List<string> Suggests { get; set; }
    }
}
