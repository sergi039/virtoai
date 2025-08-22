using System.ComponentModel.DataAnnotations;

namespace NL2SQL.WebApp.Dtos.Message.Request
{
    public class NlpQueryRequestDto
    {
        [Required]
        public string Query { get; set; } = string.Empty;
        public string Model { get; set; } 
        public int ChatId { get; set; }
    }
}
