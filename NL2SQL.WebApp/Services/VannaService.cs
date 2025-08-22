using System.Text;
using System.Text.Json;
using NL2SQL.WebApp.Models.AiGenerate.Response;
using NL2SQL.WebApp.Models.Message.Response;
using NL2SQL.WebApp.Services.Interfaces;

public class VannaService : IVannaService
{
    private readonly HttpClient httpClient;
    private readonly string azureFlaskUrl;
    private readonly string apiKey;

    public VannaService(IConfiguration configuration)
    {
        azureFlaskUrl = configuration["VannaAzure:FlaskUrl"] ??
            throw new InvalidOperationException("VannaAzure:FlaskUrl not configured");

        apiKey = configuration["VannaAzure:ApiKey"] ??
            throw new InvalidOperationException("VannaAzure:ApiKey not configured");

        httpClient = new HttpClient();
        httpClient.Timeout = TimeSpan.FromMinutes(3);
        httpClient.DefaultRequestHeaders.Add("X-API-Key", apiKey);
    }

    public async Task<RagKnowledgeExtractorModel> ExtractKnowledgeAsync(string naturalLanguageQuery, string? model = null)
    {
        if (string.IsNullOrWhiteSpace(naturalLanguageQuery))
            return new RagKnowledgeExtractorModel() { Error = "Natural language query is required" };

        try
        {
            var request = new { query = naturalLanguageQuery };
            var jsonRequest = JsonSerializer.Serialize(request);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(
                $"{azureFlaskUrl}/get-context",
                content
            );

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return new RagKnowledgeExtractorModel() { Error = $"Azure Flask API error: {response.StatusCode}" };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<RagKnowledgeExtractorModel>(responseContent, options)
                   ?? new RagKnowledgeExtractorModel { Error = "Failed to deserialize response" };
        }
        catch (HttpRequestException ex)
        {
            return new RagKnowledgeExtractorModel() { Error = $"Azure Flask API communication error: {ex.Message}" };
        }
        catch (JsonException ex)
        {
            return new RagKnowledgeExtractorModel
            {
                Error = $"Error parsing JSON response: {ex.Message}"
            };
        }
        catch (Exception ex)
        {
            return new RagKnowledgeExtractorModel() { Error = $"Unexpected error: {ex.Message}" };
        }
    }

    public async Task<SqlGenerationResultModel> GenerateSqlAsync(string naturalLanguageQuery, int chatId, string? model = null)
    {
        if (string.IsNullOrWhiteSpace(naturalLanguageQuery))
            return new SqlGenerationResultModel(null, "Natural language query is required");

        try
        {
            var request = new { query = naturalLanguageQuery, model = model ?? "openai", chatId = chatId };
            var jsonRequest = JsonSerializer.Serialize(request);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var timeoutMs = (model == "local") ? 300000 : 60000;
            using var cts = new CancellationTokenSource(timeoutMs);

            var response = await httpClient.PostAsync(
                $"{azureFlaskUrl}/generate-sql",
                content,
                cts.Token
            );

            var responseContent = await response.Content.ReadAsStringAsync(cts.Token);

            if (!response.IsSuccessStatusCode)
                return new SqlGenerationResultModel(null, $"Azure Flask API error: {response.StatusCode}");

            return ParseJsonResponse(responseContent);
        }
        catch (OperationCanceledException)
        {
            return new SqlGenerationResultModel(null, $"Timeout waiting for Azure Flask API response. Model: {model}");
        }
        catch (HttpRequestException ex)
        {
            return new SqlGenerationResultModel(null, $"Azure Flask API communication error: {ex.Message}");
        }
        catch (Exception ex)
        {
            return new SqlGenerationResultModel(null, $"Unexpected error: {ex.Message}");
        }
    }

    private SqlGenerationResultModel ParseJsonResponse(string jsonResponse)
    {
        try
        {
            using JsonDocument doc = JsonDocument.Parse(jsonResponse);
            var root = doc.RootElement;

            var sqlResult = root.TryGetProperty("sql", out var sqlProp) ? sqlProp.GetString() : null;
            var errorResult = root.TryGetProperty("error", out var errorProp) ? errorProp.GetString() : null;
            var modelResult = root.TryGetProperty("model", out var modelProp) ? modelProp.GetString() : null;

            if (string.IsNullOrEmpty(errorResult))
            {
                return new SqlGenerationResultModel(new List<SQLGenerationModel>
                {
                    new SQLGenerationModel { Model = modelResult ?? "default", Sql = sqlResult ?? string.Empty }
                }, null);
            }
            return new SqlGenerationResultModel(null, errorResult);
        }
        catch (JsonException ex)
        {
            return new SqlGenerationResultModel(null, $"Invalid JSON response: {ex.Message}");
        }
    }

    public void ReinitializeModels()
    {
        Task.Run(async () =>
        {
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(7));

                var content = new StringContent("{}", Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(
                    $"{azureFlaskUrl}/reinitialize-models",
                    content
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reinitializing models: {ex.Message}");
            }
        });
    }
}