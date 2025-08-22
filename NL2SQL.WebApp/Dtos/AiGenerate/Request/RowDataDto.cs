using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.AiGenerate.Request
{
    public class RowDataDto
    {
        [Required]
        public string Key { get; set; }

        public object? Value { get; set; } = null;
    }
}
