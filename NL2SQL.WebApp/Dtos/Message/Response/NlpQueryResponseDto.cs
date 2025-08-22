namespace NL2SQL.WebApp.Dtos.Message.Response
{
    public class NlpQueryResponseDto
    {
        public string Sql { get; set; } = string.Empty;
        public List<Dictionary<string, object>> Results { get; set; } = new List<Dictionary<string, object>>();
        public string ModelName { get; set; } = string.Empty;
        public bool IsSyntaxError { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
