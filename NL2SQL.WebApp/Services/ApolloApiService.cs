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
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return default;
            }

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<ApolloContactModel> GetContactAsync(string contactId)
        {
            try
            {
                var response = await PostRequestAsync<ApolloPersonResponseModel>("people/show", new { id = contactId });
                return response?.Person;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ApolloOrganizationModel> GetOrganizationAsync(string organizationId)
        {
            try
            {
                var response = await PostRequestAsync<ApolloOrganizationResponseModel>("organizations/show", new { id = organizationId });
                return response?.Organization;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ApolloContactModel>> SearchContactsAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var response = await PostRequestAsync<ApolloSearchResponseModel>("people/search", parameters);
                var contacts = response?.People ?? new List<ApolloContactModel>();
                return contacts;
            }
            catch (Exception ex)
            {
                return new List<ApolloContactModel>();
            }
        }
    }
}
