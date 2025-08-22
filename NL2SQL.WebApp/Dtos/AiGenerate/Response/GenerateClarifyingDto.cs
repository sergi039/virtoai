namespace NL2SQL.WebApp.Dtos.AiGenerate.Response
{
    public class GenerateClarifyingDto
    {
        public string MainGeneratedQuery { get; set; }
        public List<string> Questions { get; set; }
        public List<string> Suggests { get; set; }
    }
}
