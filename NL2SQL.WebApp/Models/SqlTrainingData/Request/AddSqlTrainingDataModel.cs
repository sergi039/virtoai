namespace NL2SQL.WebApp.Models.SqlTrainingData.Request
{
    public class AddSqlTrainingDataModel
    {
        public string NaturalLanguageQuery { get; set; }
        public string GeneratedSql { get; set; }
    }
}
