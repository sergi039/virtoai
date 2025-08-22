using NL2SQL.WebApp.Models.Speech.Response;

namespace NL2SQL.WebApp.Services.Interfaces;

public interface ISpeechService
{
    Task<SpeechTokenModel> GetSpeechTokenAsync();
}