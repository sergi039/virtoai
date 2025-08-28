using NL2SQL.WebApp.Models.Apollo.Response;
using NL2SQL.WebApp.Services.Interfaces;
using System.Text.Json;
using System.Text;

namespace NL2SQL.WebApp.Services
{
    public class ApolloApiService : IApolloApiService
    {
        private readonly HttpClient _httpClient;
        private readonly SecretsManager _secretsManager;
        private const int DefaultLimit = 100;

        public ApolloApiService(HttpClient httpClient, SecretsManager secretsManager)
        {
            _httpClient = httpClient;
            _secretsManager = secretsManager;
        }

        private async Task<T?> PostRequestAsync<T>(string endpoint, object data)
        {
            var (apiKey, apiUrl) = _secretsManager.GetSecret("apollo");
            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("APOLLO_API_KEY is not set.");

            var request = new HttpRequestMessage(HttpMethod.Post, $"{apiUrl.TrimEnd('/')}/{endpoint}");
            request.Headers.Add("X-Api-Key", apiKey);
            request.Headers.Add("Cache-Control", "no-cache");
            request.Content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return default;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        private async Task<T?> GetRequestAsync<T>(string endpoint)
        {
            var (apiKey, apiUrl) = _secretsManager.GetSecret("apollo");
            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("APOLLO_API_KEY is not set.");

            var request = new HttpRequestMessage(HttpMethod.Get, $"{apiUrl.TrimEnd('/')}/{endpoint}");
            request.Headers.Add("X-Api-Key", apiKey);
            request.Headers.Add("Cache-Control", "no-cache");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return default;

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<ApolloContactModel?> GetContactAsync(string contactId)
        {
            try
            {
                var response = await PostRequestAsync<ApolloPersonResponseModel>(
                    "people/match",
                    new { id = contactId }
                );

                return response?.Person;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ApolloOrganizationModel?> GetOrganizationAsync(string organizationId)
        {
            try
            {
                var response = await GetRequestAsync<ApolloOrganizationResponseModel>($"organizations/{organizationId}");

                return response?.Organization;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetOrganizationAsync error: {ex.Message}");
                return null;
            }
        }

        public async Task<List<ApolloContactModel>> SearchContactsAsync(Dictionary<string, object> parameters, int limit)
        {
            var result = new List<ApolloContactModel>();

            try
            {
                var totalFetched = 0;
                var page = 1;

                while (totalFetched < limit)
                {
                    var remaining = limit - totalFetched;
                    var perPage = remaining > DefaultLimit ? DefaultLimit : remaining;

                    parameters["page"] = page;
                    parameters["per_page"] = perPage;
                    parameters["sort_by"] = "created_at";
                    parameters["order"] = "desc";

                    var response = await PostRequestAsync<ApolloSearchResponseModel>("people/search", parameters);
                    var contacts = response?.People ?? new List<ApolloContactModel>();

                    if (contacts.Count == 0)
                        break;

                    foreach (var contact in contacts)
                    {
                        var fullContact = await GetContactAsync(contact.Id);
                        if (fullContact != null)
                            result.Add(fullContact);
                    }

                    totalFetched += contacts.Count;

                    if (contacts.Count < perPage) 
                        break;

                    page++;
                }

                return result.Take(limit).ToList();
            }
            catch (Exception ex)
            {
                return result;
            }
        }

    }
}
