using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.SqlTrainingData.Request
{
    public class AddSqlTrainingDataDto
    {
        [Required(ErrorMessage = "Natural Language Query is required")]
        public string NaturalLanguageQuery { get; set; }
        [Required(ErrorMessage = "Generated Sql is required")]
        public string GeneratedSql { get; set; }
    }
}
