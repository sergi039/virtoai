namespace NL2SQL.WebApp.Dtos.SqlTrainingData.Request
{
    public class RemoveSqlTrainingDataDto
    {
        public string NaturalLanguageQuery { get; set; }
        public string GeneratedSql { get; set; }
    }
}
