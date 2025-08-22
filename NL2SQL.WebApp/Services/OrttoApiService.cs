using Microsoft.Extensions.Options;
using NL2SQL.WebApp.Models.Ortto.Response;
using NL2SQL.WebApp.Services.Interfaces;
using System.Text.Json;

namespace NL2SQL.WebApp.Services
{
    public class OrttoApiService : IOrttoApiService
    {
        private readonly HttpClient _httpClient;
        private readonly SecretsManager _secretsManager;

        public OrttoApiService(HttpClient httpClient, SecretsManager secretsManager)
        {
            _httpClient = httpClient;
            _secretsManager = secretsManager;
        }

        private async Task<T> MakePostRequestAsync<T>(string endpoint, object body)
        {
            var (apiKey, apiUrl) = _secretsManager.GetSecret("ortto");

            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("ORTTO_API_KEY is not set.");

            var request = new HttpRequestMessage(HttpMethod.Post, $"{apiUrl.TrimEnd('/')}/{endpoint}");
            request.Headers.Add("X-Api-Key", apiKey);
            request.Content = new StringContent(JsonSerializer.Serialize(body), System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<(List<OrttoPersonModel> Persons, string NextCursor)> FetchOrttoPersonsAsync(int limit = 100, string cursor = null)
        {
            try
            {
                object body = string.IsNullOrEmpty(cursor)
                    ? new { limit, fields = new[] { "str::first", "str::last", "str::email", "str::subscription_status" } }
                    : new { limit, cursor_id = cursor, fields = new[] { "str::first", "str::last", "str::email", "str::subscription_status" } };

                var response = await MakePostRequestAsync<OrttoPersonResponse>("v1/person/get", body);
                var persons = response.Contacts;
                var nextCursor = response.CursorId;

                return (persons, nextCursor);
            }
            catch (Exception ex)
            {
                return (new List<OrttoPersonModel>(), null);
            }
        }

        public async Task<(List<OrttoOrganizationModel> Organizations, string NextCursor)> FetchOrttoOrganizationsAsync(int limit = 100, string cursor = null)
        {
            try
            {
                object body = string.IsNullOrEmpty(cursor)
                    ? new { limit, fields = new[] { "str:o:name", "int:o:employees", "str:o:industry", "str:o:website" } }
                    : new { limit, cursor_id = cursor, fields = new[] { "str:o:name", "int:o:employees", "str:o:industry", "str:o:website" } };

                var response = await MakePostRequestAsync<OrttoOrganizationResponse>("v1/organizations/get", body);
                var organizations = response.Organizations;
                var nextCursor = response.CursorId;

                return (organizations, nextCursor);
            }
            catch (Exception ex)
            {
                return (new List<OrttoOrganizationModel>(), null);
            }
        }

        public async Task<List<OrttoActivityModel>> FetchOrttoActivitiesAsync(string personId)
        {
            try
            {
                var body = new
                {
                    person_id = personId,
                    limit = 50, 
                    offset = 0 
                };
                var response = await MakePostRequestAsync<OrttoActivityResponse>("v1/person/get/activities", body);
                var activities = response.Activities;

                return activities;
            }
            catch (Exception ex)
            {
                return new List<OrttoActivityModel>();
            }
        }

        public async Task FetchAndImportAllDataAsync()
        {
            var allPersons = new List<OrttoPersonModel>();
            var allOrganizations = new List<OrttoOrganizationModel>();
            var allActivities = new List<OrttoActivityModel>();

            string nextCursor = null;

            var (persons, cursoPersonr) = await FetchOrttoPersonsAsync(limit: 100, cursor: nextCursor);

            allPersons.AddRange(persons);

            var (organizations, cursor) = await FetchOrttoOrganizationsAsync(limit: 100, cursor: nextCursor);

            allOrganizations.AddRange(organizations);

            var personIdsForActivities = allPersons.Take(100).Select(p => p.Id).ToList();
            foreach (var personId in personIdsForActivities)
            {
                var activities = await FetchOrttoActivitiesAsync(personId);
                if (activities.Any())
                {
                    allActivities.AddRange(activities);
                }
                await Task.Delay(500);
            }
        }
    }
}
