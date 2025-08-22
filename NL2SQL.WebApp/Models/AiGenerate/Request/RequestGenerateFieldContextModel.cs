namespace NL2SQL.WebApp.Models.AiGenerate.Request
{
    public class RequestGenerateFieldContextModel
    {
        public string TableName { get; set; }

        public string FieldName { get; set; }

        public int ChatId { get; set; }

        public bool IsFieldExist { get; set; }

        public IList<RowDataModel> RowData { get; set; }
    }
}
