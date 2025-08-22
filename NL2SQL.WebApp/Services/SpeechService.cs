using NL2SQL.WebApp.Models.Speech.Response;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services;

public class SpeechService : ISpeechService
{
    private readonly string _subscriptionKey;
    private readonly string _region;
    private readonly string _translatorSubscriptionKey;
    private readonly string _translatorRegion;
    private readonly IReadOnlyList<string> _supportedLanguages = new List<string> { "en-US", "ru-RU", "uk-UA" };

    public SpeechService(IConfiguration configuration)
    {
        _subscriptionKey = configuration["AzureSpeech:ApiKey"];
        _region = configuration["AzureSpeech:Region"];
        _translatorSubscriptionKey = configuration["AzureTranslator:ApiKey"]; 
        _translatorRegion = configuration["AzureTranslator:Region"];

        if (string.IsNullOrEmpty(_subscriptionKey) || string.IsNullOrEmpty(_region))
            throw new InvalidOperationException("ApiKey or region is not set.");

        if (string.IsNullOrEmpty(_translatorSubscriptionKey) || string.IsNullOrEmpty(_translatorRegion))
            throw new InvalidOperationException("ApiKey or region is not set for Translator Service.");
    }

    public async Task<SpeechTokenModel> GetSpeechTokenAsync()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", _subscriptionKey);

        var response = await client.PostAsync(
            $"https://{_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken", null);

        response.EnsureSuccessStatusCode();

        return new SpeechTokenModel(await response.Content.ReadAsStringAsync(), _region);
    }
}
