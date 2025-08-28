using NL2SQL.WebApp.Models.Pipedrive.Response;
using NL2SQL.WebApp.Services.Interfaces;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace NL2SQL.WebApp.Services
{
    public class PipedriveApiService : IPipedriveApiService
    {
        private readonly HttpClient _httpClient;
        private readonly SecretsManager _secretsManager;

        public PipedriveApiService(HttpClient httpClient, SecretsManager secretsManager)
        {
            _httpClient = httpClient;
            _secretsManager = secretsManager;
        }

        private async Task<List<T>> FetchAllItemsAsync<T>(string endpoint, string since = null, int totalLimit = 100, int chunkSize = 50)
        {
            var items = new List<T>();
            var start = 0;
            var remainingLimit = totalLimit;
            var effectiveChunkSize = Math.Min(chunkSize, totalLimit);

            var (apiKey, apiUrl) = _secretsManager.GetSecret("pipedrive");

            var parameters = new Dictionary<string, string>
            {
                { "api_token", apiKey },
                { "sort_by", "add_time" },
                { "sort_direction", "desc" }
            };

            if (!string.IsNullOrEmpty(since))
                parameters["since_timestamp"] = since;

            while (remainingLimit > 0)
            {
                parameters["start"] = start.ToString();
                parameters["limit"] = Math.Min(effectiveChunkSize, remainingLimit).ToString();
                var queryString = string.Join("&", parameters.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));
                var url = $"{apiUrl.TrimEnd('/')}/{endpoint}?{queryString}";

                try
                {
                    var response = await _httpClient.GetAsync(url);
                    if (!response.IsSuccessStatusCode)
                    {
                        break;
                    }

                    var content = await response.Content.ReadAsStringAsync();

                    content = Regex.Replace(content, @"(""(update_time|add_time|close_time|marked_as_done_time)"":\"")([^""]+)("")",
                        match =>
                        {
                            var value = match.Groups[3].Value;
                            return !string.IsNullOrEmpty(value)
                                ? $"{match.Groups[1].Value}{value.Replace(" ", "T")}{match.Groups[4].Value}"
                                : match.Value;
                        });

                    var data = JsonSerializer.Deserialize<PipedriveApiResponseModel<T>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (!data.Success)
                    {
                        break;
                    }

                    var batch = data.Data ?? new List<T>();
                    if (!batch.Any())
                        break;

                    items.AddRange(batch);
                    remainingLimit -= batch.Count;

                    var moreItems = data.AdditionalData?.Pagination?.MoreItemsInCollection ?? false;
                    if (!moreItems)
                        break;

                    start += batch.Count;
                    await Task.Delay(500);
                }
                catch (Exception)
                {
                    break;
                }
            }

            return items;
        }

        public Task<List<PipedriveOrganizationModel>> FetchOrganizationsAsync(string since = null, int limit = 100)
            => FetchAllItemsAsync<PipedriveOrganizationModel>("organizations", since, limit, 50);

        public Task<List<PipedriveContactModel>> FetchContactsAsync(string since = null, int limit = 100)
            => FetchAllItemsAsync<PipedriveContactModel>("persons", since, limit, 50);

        public Task<List<PipedriveDealModel>> FetchDealsAsync(string since = null, int limit = 100)
            => FetchAllItemsAsync<PipedriveDealModel>("deals", since, limit, 50);

        public Task<List<PipedriveActivityModel>> FetchActivitiesAsync(string since = null, int limit = 100)
            => FetchAllItemsAsync<PipedriveActivityModel>("activities", since, limit, 50);
    }
}