namespace NL2SQL.WebApp.Models.Message.Response
{
    public class NlpQueryResponseModel
    {
        public string Sql { get; set; } = string.Empty;
        public List<Dictionary<string, object>> Results { get; set; } = new List<Dictionary<string, object>>();
        public string ModelName { get; set; } = string.Empty;
        public bool IsSyntaxError { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
