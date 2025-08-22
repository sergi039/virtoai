namespace NL2SQL.WebApp.Dtos.Message.Response
{
    public class NlpClarificationResponseDto
    {
        public bool NeedsClarification { get; set; }
        public IList<string> Questions { get; set; } = new List<string>();
        public GeneralNlpQueryResponseDto? Result { get; set; }
    }
}
