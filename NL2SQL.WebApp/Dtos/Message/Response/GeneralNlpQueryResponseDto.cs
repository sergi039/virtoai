namespace NL2SQL.WebApp.Dtos.Message.Response
{
    public class GeneralNlpQueryResponseDto
    {
        public IList<NlpQueryResponseDto> SqlQueries { get; set; } = new List<NlpQueryResponseDto>();
    }
}
