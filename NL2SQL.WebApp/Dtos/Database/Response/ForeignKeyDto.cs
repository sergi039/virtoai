namespace NL2SQL.WebApp.Dtos.Database.Response
{
    public class ForeignKeyDto
    {
        public string ConstraintName { get; set; }
        public string SourceTable { get; set; }
        public string SourceColumn { get; set; }
        public string TargetTable { get; set; }
        public string TargetColumn { get; set; }
    }
}
