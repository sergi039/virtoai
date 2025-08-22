namespace NL2SQL.WebApp.Models.Message.Response
{
    public class GeneralNlpQueryResponseModel
    {
        public IList<NlpQueryResponseModel> SqlQueries { get; set; } = new List<NlpQueryResponseModel>();
    }
}
