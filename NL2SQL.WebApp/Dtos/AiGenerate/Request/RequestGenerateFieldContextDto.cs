using NL2SQL.WebApp.Dtos.AiGenerate.Request;

namespace NL2SQL.WebApp.Dtos.FieldContext.Request
{
    public class RequestGenerateFieldContextDto
    {
        public string TableName { get; set; }

        public string FieldName { get; set; }

        public int ChatId { get; set; }

        public bool IsFieldExist { get; set; }

        public IList<RowDataDto> RowData { get; set; }
    }
}
