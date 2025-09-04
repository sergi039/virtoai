using NL2SQL.WebApp.Services.Interfaces;
using System.Net.Http.Headers;
using System.Text.Json;
using NL2SQL.WebApp.Models.Freshdesk.Response;
using System.Text.RegularExpressions;
using NL2SQL.WebApp.Utils;

namespace NL2SQL.WebApp.Services
{
    public class FreshdeskApiService : IFreshdeskApiService
    {
        private readonly HttpClient _httpClient;
        private readonly SecretsManager _secretsManager;
        private int _apiCallsHour;
        private int _apiCallsMinute;
        private DateTime _lastApiCallMinute;
        private DateTime _lastApiCallHour;
        private const int DefaultLimit = 100;
        private const bool DefaultVerifySsl = true;
        private const int ApiCallsPerHour = 1000;
        private const int ApiCallsPerMinute = 50;
        private const int RateLimitResetSeconds = 60;

        public FreshdeskApiService(HttpClient httpClient, SecretsManager secretsManager)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _secretsManager = secretsManager;
            _apiCallsHour = 0;
            _apiCallsMinute = 0;
            _lastApiCallMinute = DateTime.Now;
            _lastApiCallHour = DateTime.Now;
        }

        private async Task TrackApiCallAsync()
        {
            var now = DateTime.Now;
            if (now.Minute != _lastApiCallMinute.Minute)
            {
                _apiCallsMinute = 0;
                _lastApiCallMinute = now;
            }
            if (now.Hour != _lastApiCallHour.Hour)
            {
                _apiCallsHour = 0;
                _lastApiCallHour = now;
            }

            if (_apiCallsMinute >= ApiCallsPerMinute - 5)
            {
                var sleepTime = Math.Max(3, Math.Min(RateLimitResetSeconds, 60));
                await Task.Delay(TimeSpan.FromSeconds(sleepTime));
                _apiCallsMinute = 0;
            }

            if (_apiCallsHour >= ApiCallsPerHour - 50)
            {
                var secondsToNextHour = (60 - now.Minute) * 60;
                await Task.Delay(TimeSpan.FromSeconds(secondsToNextHour));
                _apiCallsHour = 0;
            }

            _apiCallsMinute++;
            _apiCallsHour++;
        }

        private async Task<(T, IReadOnlyDictionary<string, string>)> MakeRequestWithHeadersAsync<T>(
            string endpoint, Dictionary<string, string> parameters = null, bool verifySsl = true)
        {
            var (apiKey, apiUrl) = _secretsManager.GetSecret("freshdesk");
            await TrackApiCallAsync();
            var requestUri = $"{apiUrl}/{endpoint}";
            if (parameters != null && parameters.Any())
                requestUri += "?" + string.Join("&", parameters.Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));

            var request = new HttpRequestMessage(HttpMethod.Get, requestUri);
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{apiKey}:X")));

            if (!verifySsl)
                _httpClient.DefaultRequestHeaders.Add("No-Verify-SSL", "true");

            var response = await _httpClient.SendAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                var waitTime = int.Parse(response.Headers.GetValues("Retry-After").FirstOrDefault() ?? "60");
                await Task.Delay(TimeSpan.FromSeconds(waitTime));
                return await MakeRequestWithHeadersAsync<T>(endpoint, parameters, verifySsl);
            }

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return (result, response.Headers.ToDictionary(h => h.Key, h => string.Join(",", h.Value)));
        }

        private async Task<T> MakeRequestAsync<T>(string endpoint, Dictionary<string, string> parameters = null, bool verifySsl = true)
        {
            var (result, _) = await MakeRequestWithHeadersAsync<T>(endpoint, parameters, verifySsl);
            return result;
        }

        public async Task<List<AgentModel>> GetAgentsAsync(bool verifySsl = true, int limit = DefaultLimit)
        {
            var agents = new List<AgentModel>();
            var page = 1;

            while (true)
            {
                await TrackApiCallAsync();
                var parameters = new Dictionary<string, string>
                {
                    { "per_page", limit.ToString() },
                    { "page", page.ToString() }
                };

                try
                {
                    var pageAgents = await MakeRequestAsync<List<AgentModel>>("agents", parameters, verifySsl);

                    if (pageAgents.IsNullOrEmpty())
                        break;

                    agents.AddRange(pageAgents);

                    if (agents.Count <= limit)
                        break;

                    page++;
                }
                catch (Exception)
                {
                    break;
                }
            }

            return agents;
        }

        public async Task<Dictionary<int, string>> GetTicketFieldOptionsAsync(string fieldName)
        {
            var allFields = await MakeRequestAsync<List<TicketFieldResponse>>("admin/ticket_fields");

            var statusField = allFields.FirstOrDefault(f => f.Name == fieldName || f.Type == fieldName);
            if (statusField == null)
                throw new Exception($"Field {fieldName} not found in Freshdesk");

            var statusDetails = await MakeRequestAsync<TicketFieldResponse>($"admin/ticket_fields/{statusField.Id}");

            var result = new Dictionary<int, string>();
            foreach (var kvp in statusDetails.Choices)
            {
                if (!int.TryParse(kvp.Key, out var code)) continue;

                if (kvp.Value is JsonElement jsonElem)
                {
                    if (jsonElem.ValueKind == JsonValueKind.Array)
                    {
                        result[code] = jsonElem[0].GetString() ?? "";
                    }
                    else if (jsonElem.ValueKind == JsonValueKind.String)
                    {
                        result[code] = jsonElem.GetString() ?? "";
                    }
                }
                else
                {
                    result[code] = kvp.Value.ToString() ?? "";
                }
            }

            return result;
        }

        public async Task<List<ContactModel>> GetContactsAsync(bool verifySsl, int limit, int page = 1)
        {
            await GetTicketFieldOptionsAsync("source");
            var allContacts = new List<ContactModel>();
            const int perPage = 100;
            var totalPages = (int)Math.Ceiling((double)limit / perPage);

            while (page <= totalPages)
            {
                var parameters = new Dictionary<string, string>
                {
                    { "per_page", perPage.ToString() },
                    { "page", page.ToString() }
                };

                try
                {
                    var contacts = await MakeRequestAsync<List<ContactModel>>("contacts", parameters, verifySsl);
                    if (contacts == null || !contacts.Any())
                        break;

                    allContacts.AddRange(contacts);

                    if (allContacts.Count >= limit)
                        return allContacts.Take(limit).ToList();

                    page++;
                    await Task.Delay(1000);
                }
                catch (Exception)
                {
                    await Task.Delay(5000);
                    try
                    {
                        var contacts = await MakeRequestAsync<List<ContactModel>>("contacts", parameters, verifySsl);

                        if (contacts == null || !contacts.Any())
                            break;

                        allContacts.AddRange(contacts);

                        if (allContacts.Count >= limit)
                            return allContacts.Take(limit).ToList();

                        page++;
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }

            }

            return allContacts;
        }

        public async Task<List<CompanyModel>> GetCompaniesAsync(bool verifySsl, int limit, int page = 1)
        {
            var allCompanies = new List<CompanyModel>();
            const int perPage = 100;
            var totalPages = (int)Math.Ceiling((double)limit / perPage);

            while (page <= totalPages)
            {
                var parameters = new Dictionary<string, string>
                {
                    { "per_page", perPage.ToString()},
                    { "page", page.ToString() }
                };

                try
                {
                    var companies = await MakeRequestAsync<List<CompanyModel>>("companies", parameters, verifySsl);

                    if (companies == null || !companies.Any())
                        break;

                    allCompanies.AddRange(companies);

                    if (allCompanies.Count >= limit)
                        return allCompanies.Take(limit).ToList();

                    page++;
                    await Task.Delay(1000);
                }
                catch (Exception)
                {
                    await Task.Delay(5000);
                    try
                    {
                        var companies = await MakeRequestAsync<List<CompanyModel>>("companies", parameters, verifySsl);

                        if (companies == null || !companies.Any())
                            break;

                        allCompanies.AddRange(companies);

                        if (allCompanies.Count >= limit)
                            return allCompanies.Take(limit).ToList();

                        page++;
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }

            return allCompanies;
        }

        public async Task<List<TicketModel>> GetTicketsAsync(int limit, DateTime? since = null, bool verifySsl = true)
        {
            var allTickets = new List<TicketModel>();
            var page = 1;
            const int perPage = 100;
            var totalPages = (int)Math.Ceiling((double)limit / perPage); 

            while (page <= totalPages)
            {
                var parameters = new Dictionary<string, string>
                {
                    { "per_page", perPage.ToString() },
                    { "page", page.ToString() },
                    { "include", "requester, description" },
                    { "order_by", "created_at"},
                };

                if (since.HasValue)
                    parameters["updated_since"] = since.Value.ToString("yyyy-MM-dd");

                try
                {
                    var (response, headers) = await MakeRequestWithHeadersAsync<List<TicketModel>>("tickets", parameters, verifySsl);
                    if (response == null || !response.Any())
                        break;

                    allTickets.AddRange(response);

                    if (allTickets.Count >= limit)
                        return allTickets.Take(limit).ToList();

                    if (headers.TryGetValue("Link", out var linkHeader) && linkHeader.Contains("rel=\"last\""))
                    {
                        var match = Regex.Match(linkHeader, @"page=(\d+)>; rel=""last""");
                        if (match.Success)
                            totalPages = Math.Min(totalPages, int.Parse(match.Groups[1].Value));
                    }

                    page++;
                    await Task.Delay(1000);
                }
                catch (Exception)
                {
                    page++;
                    await Task.Delay(5000);
                    try
                    {
                        var (response, headers) = await MakeRequestWithHeadersAsync<List<TicketModel>>("tickets", parameters, verifySsl);
                        if (response == null || !response.Any())
                            break;

                        allTickets.AddRange(response);

                        if (allTickets.Count >= limit)
                            return allTickets.Take(limit).ToList();

                        if (headers.TryGetValue("Link", out var linkHeader) && linkHeader.Contains("rel=\"last\""))
                        {
                            var match = Regex.Match(linkHeader, @"page=(\d+)>; rel=""last""");
                            if (match.Success)
                                totalPages = Math.Min(totalPages, int.Parse(match.Groups[1].Value));
                        }
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }

            return allTickets;
        }

        public async Task<TicketModel> GetTicketByIdAsync(int ticketId, bool verifySsl = true)
        {
            try
            {
                var ticket = await MakeRequestAsync<TicketModel>($"tickets/{ticketId}", verifySsl: verifySsl);
                return ticket;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<List<ConversationModel>> GetConversationsAsync(int ticketId, bool verifySsl = true)
        {
            try
            {
                var conversations = await MakeRequestAsync<List<ConversationModel>>($"tickets/{ticketId}/conversations", verifySsl: verifySsl);
                return conversations ?? new List<ConversationModel>();
            }
            catch (Exception)
            {
                return new List<ConversationModel>();
            }
        }

        public async Task<List<TicketFieldModel>> GetTicketFieldsAsync(bool verifySsl = true)
        {
            try
            {
                var fields = await MakeRequestAsync<List<TicketFieldModel>>("ticket_fields", verifySsl: verifySsl);
                return fields ?? new List<TicketFieldModel>();
            }
            catch (Exception)
            {
                return new List<TicketFieldModel>();
            }
        }

        public async Task<SearchTicketResponseModel> SearchTicketsAsync(string query, int page, int perPage, bool verifySsl)
        {
            try
            {
                var parameters = new Dictionary<string, string>
                {
                    { "query", query },
                    { "page", page.ToString() },
                    { "per_page", perPage.ToString() }
                };
                var response = await MakeRequestAsync<SearchTicketResponseModel>("search/tickets", parameters, verifySsl);
                return response ?? new SearchTicketResponseModel { Results = new List<TicketModel>(), Total = 0 };
            }
            catch (Exception)
            {
                return new SearchTicketResponseModel { Results = new List<TicketModel>(), Total = 0 };
            }
        }

        public async Task<List<TicketModel>> GetAllTicketsFromSearchAsync(int limit, string startDate, string endDate, bool verifySsl = true)
        {
            var allTickets = new List<TicketModel>();

            var directTickets = await GetTicketsAsync(limit, verifySsl: verifySsl);
            if (directTickets.Any())
                return directTickets;

            var simpleTickets = await FetchTicketsWithSimpleQueryAsync(startDate, endDate, verifySsl);
            if (simpleTickets.Any())
            {
                allTickets.AddRange(simpleTickets);
                return allTickets;
            }

            var startDt = DateTime.Parse(startDate);
            var endDt = DateTime.Parse(endDate);
            var totalDays = (endDt - startDt).Days;

            if (totalDays > 365)
            {
                var currentYearStart = startDt;
                while (currentYearStart < endDt)
                {
                    var currentYearEnd = currentYearStart.AddYears(1).AddDays(-1) < endDt
                        ? currentYearStart.AddYears(1).AddDays(-1)
                        : endDt;

                    var yearStart = currentYearStart.ToString("yyyy-MM-dd");
                    var yearEnd = currentYearEnd.ToString("yyyy-MM-dd");

                    var currentQuarterStart = currentYearStart;
                    while (currentQuarterStart <= currentYearEnd)
                    {
                        var currentQuarterEnd = CalculateQuarterEnd(currentQuarterStart, currentYearEnd);
                        var quarterStart = currentQuarterStart.ToString("yyyy-MM-dd");
                        var quarterEnd = currentQuarterEnd.ToString("yyyy-MM-dd");

                        var currentMonthStart = currentQuarterStart;
                        while (currentMonthStart <= currentQuarterEnd)
                        {
                            var currentMonthEnd = CalculateMonthEnd(currentMonthStart, currentQuarterEnd);
                            var monthStart = currentMonthStart.ToString("yyyy-MM-dd");
                            var monthEnd = currentMonthEnd.ToString("yyyy-MM-dd");

                            var monthTickets = await FetchTicketsInDateRangeAsync(monthStart, monthEnd, verifySsl);
                            if (monthTickets.Count >= 3000)
                            {
                                monthTickets = await FetchTicketsByWeekAsync(currentMonthStart, currentMonthEnd, verifySsl);
                            }

                            allTickets.AddRange(monthTickets);
                            currentMonthStart = currentMonthEnd.AddDays(1);
                        }

                        currentQuarterStart = currentQuarterEnd.AddDays(1);
                    }

                    currentYearStart = currentYearEnd.AddDays(1);
                }
            }
            else
            {
                var batchTickets = await FetchTicketsInDateRangeAsync(startDate, endDate, verifySsl);
                if (batchTickets.Count >= 3000)
                {
                    var currentDate = startDt;
                    var interval = TimeSpan.FromDays(30);

                    while (currentDate < endDt)
                    {
                        var nextDate = currentDate + interval < endDt ? currentDate + interval : endDt;
                        var monthStart = currentDate.ToString("yyyy-MM-dd");
                        var monthEnd = nextDate.ToString("yyyy-MM-dd");

                        var monthTickets = await FetchTicketsInDateRangeAsync(monthStart, monthEnd, verifySsl);
                        if (monthTickets.Count >= 3000)
                        {
                            monthTickets = await FetchTicketsByWeekAsync(currentDate, nextDate, verifySsl);
                        }

                        allTickets.AddRange(monthTickets);
                        currentDate = nextDate.AddDays(1);
                    }
                }
                else
                {
                    allTickets.AddRange(batchTickets);
                }
            }

            return allTickets;
        }

        private async Task<List<TicketModel>> FetchTicketsWithSimpleQueryAsync(string startDate, string endDate, bool verifySsl)
        {
            var searchQueries = new[]
            {
                $"updated_at:>'{startDate}' AND updated_at:<'{endDate}'",
                $"created_at:>'{startDate}' AND created_at:<'{endDate}'",
                "status:2 OR status:3 OR status:4 OR status:5",
                "status:'open' OR status:'pending' OR status:'resolved' OR status:'closed'"
            };

            var allTickets = new List<TicketModel>();
            foreach (var query in searchQueries)
            {
                int page = 1;
                while (true)
                {
                    try
                    {
                        var response = await SearchTicketsAsync(query, page, 100, verifySsl);
                        var tickets = response?.Results ?? new List<TicketModel>();
                        if (!tickets.Any())
                            break;

                        allTickets.AddRange(tickets);

                        if (tickets.Count < 100)
                            break;

                        page++;
                        await Task.Delay(500);
                    }
                    catch (Exception)
                    {
                        break;
                    }
                }

                if (allTickets.Count > 100)
                    break;
            }

            return allTickets.GroupBy(t => t.Id).Select(g => g.First()).ToList();
        }

        private async Task<List<TicketModel>> FetchTicketsInDateRangeAsync(string startDate, string endDate, bool verifySsl)
        {
            var tickets = new List<TicketModel>();
            int page = 1;
            const int maxRetries = 3;

            while (true)
            {
                int retryCount = 0;
                bool success = false;
                string query = $"created_at:>'{startDate}' AND created_at:<'{endDate}'";

                while (retryCount < maxRetries && !success)
                {
                    try
                    {
                        var response = await SearchTicketsAsync(query, page, 100, verifySsl);
                        var ticketsPage = response?.Results ?? new List<TicketModel>();
                        var totalFound = response?.Total ?? 0;

                        if (!ticketsPage.Any())
                            return tickets;

                        tickets.AddRange(ticketsPage);

                        if (ticketsPage.Count < 100)
                            return tickets;

                        if (tickets.Count >= 2900)
                            return tickets;

                        page++;
                        success = true;
                        await Task.Delay(500);
                    }
                    catch (Exception)
                    {
                        retryCount++;
                        if (retryCount >= maxRetries)
                            return tickets;
                        await Task.Delay(5000);
                    }
                }
            }
        }

        private async Task<List<TicketModel>> FetchTicketsByWeekAsync(DateTime startDt, DateTime endDt, bool verifySsl)
        {
            var allTickets = new List<TicketModel>();
            var currentDay = startDt;

            while (currentDay < endDt)
            {
                var nextDay = currentDay.AddDays(7) < endDt ? currentDay.AddDays(7) : endDt;
                var dayStart = currentDay.ToString("yyyy-MM-dd");
                var dayEnd = nextDay.ToString("yyyy-MM-dd");

                var weekTickets = await FetchTicketsInDateRangeAsync(dayStart, dayEnd, verifySsl);

                if (weekTickets.Count >= 3000)
                {
                    weekTickets = await FetchTicketsByDayAsync(currentDay, nextDay, verifySsl);
                }

                allTickets.AddRange(weekTickets);
                currentDay = nextDay;
            }

            return allTickets;
        }

        private async Task<List<TicketModel>> FetchTicketsByDayAsync(DateTime startDt, DateTime endDt, bool verifySsl)
        {
            var allTickets = new List<TicketModel>();
            var currentDay = startDt;

            while (currentDay < endDt)
            {
                var nextDay = currentDay.AddDays(1);
                var dayStart = currentDay.ToString("yyyy-MM-dd");
                var dayEnd = nextDay.ToString("yyyy-MM-dd");

                var dayTickets = await FetchTicketsInDateRangeAsync(dayStart, dayEnd, verifySsl);

                if (dayTickets.Count >= 3000)
                {
                    dayTickets = await FetchTicketsByHourAsync(currentDay, nextDay, verifySsl);
                }

                allTickets.AddRange(dayTickets);
                currentDay = nextDay;
            }

            return allTickets;
        }

        private async Task<List<TicketModel>> FetchTicketsByHourAsync(DateTime startDt, DateTime endDt, bool verifySsl)
        {
            var allTickets = new List<TicketModel>();
            var currentHour = startDt;

            while (currentHour < endDt)
            {
                var nextHour = currentHour.AddHours(1);
                var hourStart = currentHour.ToString("yyyy-MM-dd HH:00:00");
                var hourEnd = nextHour.ToString("yyyy-MM-dd HH:00:00");

                var query = $"created_at:>'{hourStart}' AND created_at:<'{hourEnd}'";
                int page = 1;

                while (true)
                {
                    try
                    {
                        var response = await SearchTicketsAsync(query, page, 100, verifySsl);
                        var ticketsPage = response?.Results ?? new List<TicketModel>();
                        if (!ticketsPage.Any())
                            break;

                        allTickets.AddRange(ticketsPage);
                        if (ticketsPage.Count < 100)
                            break;

                        page++;
                        await Task.Delay(500);
                    }
                    catch (Exception)
                    {
                        break;
                    }
                }

                currentHour = nextHour;
            }

            return allTickets;
        }

        private DateTime CalculateQuarterEnd(DateTime start, DateTime yearEnd)
        {
            if (start.Month <= 3)
                return new DateTime(start.Year, 3, 31) < yearEnd ? new DateTime(start.Year, 3, 31) : yearEnd;
            if (start.Month <= 6)
                return new DateTime(start.Year, 6, 30) < yearEnd ? new DateTime(start.Year, 6, 30) : yearEnd;
            if (start.Month <= 9)
                return new DateTime(start.Year, 9, 30) < yearEnd ? new DateTime(start.Year, 9, 30) : yearEnd;
            return new DateTime(start.Year, 12, 31) < yearEnd ? new DateTime(start.Year, 12, 31) : yearEnd;
        }

        private DateTime CalculateMonthEnd(DateTime start, DateTime quarterEnd)
        {
            var nextMonthStart = start.AddMonths(1);
            var monthEnd = nextMonthStart.AddDays(-1);
            return monthEnd < quarterEnd ? monthEnd : quarterEnd;
        }

        public async Task FetchAndImportAllDataAsync()
        {
            var allAgents = await GetAgentsAsync();
            var allCompanies = await GetCompaniesAsync(DefaultVerifySsl, DefaultLimit);
            var allContacts = await GetContactsAsync(DefaultVerifySsl, DefaultLimit);
            var allTickets = await GetTicketsAsync(DefaultLimit);
        }
    }
}