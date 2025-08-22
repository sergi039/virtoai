using System.ComponentModel.DataAnnotations.Schema;

namespace NL2SQL.WebApp.Entities;

[Table("sql_training_data")]
public class SqlTrainingDataEntity
{
    [Column("id")]
    public int Id { get; set; }

    [Column("natural_language_query")]
    public string NaturalLanguageQuery { get; set; }

    [Column("generated_sql")]
    public string GeneratedSql { get; set; }

    [Column("context")]
    public string? Context { get; set; } = null;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}