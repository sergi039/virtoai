namespace NL2SQL.WebApp.Models.Speech.Response;

public class SpeechTokenModel
{
    public string Token { get; set; }
    public string Region { get; set; }

    public SpeechTokenModel(){}

    public SpeechTokenModel(string token, string region)
    {
        Token = token;
        Region = region;
    }
}