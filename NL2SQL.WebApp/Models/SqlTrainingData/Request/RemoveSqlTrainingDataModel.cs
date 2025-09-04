namespace NL2SQL.WebApp.Models.SqlTrainingData.Request
{
    public class RemoveSqlTrainingDataModel
    {
        public string NaturalLanguageQuery { get; set; }
        public string GeneratedSql { get; set; }
    }
}
