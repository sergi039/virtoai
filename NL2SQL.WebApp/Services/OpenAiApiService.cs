using System.Text.Json;
using NL2SQL.WebApp.Models.AiGenerate.Request;
using NL2SQL.WebApp.Models.AiGenerate.Response;
using NL2SQL.WebApp.Models.Database.Response;
using NL2SQL.WebApp.Models.Message.Response;
using NL2SQL.WebApp.Services.Interfaces;
using OpenAI;
using OpenAI.Chat;

namespace NL2SQL.WebApp.Services
{
    public class OpenAiApiService : IOpenAiApiService
    {
        private readonly ChatClient _chatClient;
        private readonly IDatabaseInfoService _databaseInfoService;
        private readonly IMessageService _messageService;
        private readonly IVannaService _vannaService;
        private readonly IChatService _chatService;
        private const string DefaultNameNullRow = "Value is null";

        public OpenAiApiService(IConfiguration configuration, IDatabaseInfoService databaseInfoService, IMessageService messageService, IVannaService vannaService, IChatService chatService)
        {
            var apiKey = configuration["OpenAi:ApiKey"]
                         ?? throw new ArgumentNullException("OpenAi:ApiKey is not configured.");

            _databaseInfoService = databaseInfoService
                                   ?? throw new ArgumentNullException(nameof(databaseInfoService), "Database info service cannot be null.");

            _messageService = messageService 
                              ?? throw new ArgumentNullException(nameof(_messageService), "Message service cannot be null.");

            _vannaService = vannaService 
                              ?? throw new ArgumentNullException(nameof(_vannaService), "Vanna service cannot be null.");

            _chatService = chatService
                                ?? throw new ArgumentNullException(nameof(_chatService), "Chat service cannot be null.");

            var openAiClient = new OpenAIClient(apiKey);
            _chatClient = openAiClient.GetChatClient("gpt-4o");
        }

        public async Task<IList<string>> GenerateFieldContextAsync(RequestGenerateFieldContextModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model), "Model can not be null.");

            var messagesInChat = await _messageService.GetMessagesByChatIdAsync(model.ChatId);
            var lastUserMessages = messagesInChat
                .Where(m => m.IsUser)
                .OrderByDescending(m => m.CreatedAt)
                .Take(5)
                .ToList();

            if (!model.IsFieldExist)
            {
                return await GenerateForNonExistingFieldAsync(model, lastUserMessages);
            }
            
            return await GenerateForExistingFieldAsync(model, lastUserMessages);
        }

        private async Task<IList<string>> GenerateForExistingFieldAsync(RequestGenerateFieldContextModel model, IList<MessageModel> lastUserMessages)
        {
            var tableInfo = await _databaseInfoService.GetTableSchemaAsync(model.TableName);
            var fieldInfo = tableInfo.Fields.FirstOrDefault(f => f.Name == model.FieldName);

            if (fieldInfo == null)
                throw new ArgumentException($"Field '{model.FieldName}' not founded in table '{model.TableName}'.");

            var isPrimaryKey = fieldInfo.IsPrimaryKey;

            var fieldValue = model.RowData
                .Where(r => r.Key.Split(':')[1].Split('.')[0] == model.TableName)
                .FirstOrDefault(r => r.Key.Split(':')[1].Split('.')[1] == model.FieldName)?.Value?.ToString() ?? "unknown";

            fieldInfo.Name = model.RowData
                .Where(r => r.Key.Split(':')[1].Split('.')[0] == model.TableName)
                .FirstOrDefault(r => r.Key.Split(':')[1].Split('.')[1] == model.FieldName)?.Key.Split(':')[0]?.ToString() ?? "unknown";

            model.RowData = model.RowData
                .Where(r => r.Value != null && !string.IsNullOrWhiteSpace(r.Value?.ToString()) && !r.Value.ToString().Contains(DefaultNameNullRow))
                .ToList();

            var prompt = BuildPrompt(tableInfo, fieldInfo, fieldValue, lastUserMessages, model.RowData, isPrimaryKey);

            var messages = new[] { new UserChatMessage(prompt) };

            var completion = await _chatClient.CompleteChatAsync(messages, new ChatCompletionOptions());

            var responseText = completion.Value.Content.FirstOrDefault()?.Text?.Trim() ?? string.Empty;

            responseText = responseText
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            try
            {
                var options = JsonSerializer.Deserialize<List<string>>(responseText);
                return options.Take(5).ToList();
            }
            catch (JsonException ex)
            {
                return new List<string>();
            }
        }

        private async Task<IList<string>> GenerateForNonExistingFieldAsync(RequestGenerateFieldContextModel model, IList<MessageModel> lastUserMessages)
        {
            var fieldValue = model.RowData
                .FirstOrDefault(r => r.Key.Split(':')[0] == model.FieldName)?.Value?.ToString() ?? "unknown";

            var fieldName = model.RowData
                .FirstOrDefault(r => r.Key.Split(':')[0] == model.FieldName)?.Key.Split(':')[0]?.ToString() ?? "unknown";

            model.RowData = model.RowData
                .Where(r => r.Value != null && !string.IsNullOrWhiteSpace(r.Value?.ToString()) && !r.Value.ToString().Contains(DefaultNameNullRow))
                .ToList();

            var prompt = BuildPromptForNonExistingField(fieldName, fieldValue, lastUserMessages, model.RowData);

            var messages = new[] { new UserChatMessage(prompt) };

            var completion = await _chatClient.CompleteChatAsync(messages, new ChatCompletionOptions());

            var responseText = completion.Value.Content.FirstOrDefault()?.Text?.Trim() ?? string.Empty;

            responseText = responseText
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            try
            {
                var options = JsonSerializer.Deserialize<List<string>>(responseText);
                return options.Take(3).ToList();
            }
            catch (JsonException ex)
            {
                return new List<string>();
            }
        }

        private string BuildPrompt(TableSchemaModel tableInfo, TableFieldModel fieldInfo, 
            string fieldValue, IList<MessageModel> lastMessages, IList<RowDataModel> rowData, bool isPrimaryKey)
        {
            var lastUserQueries = lastMessages.Select(m => m.Text).ToList();

            var prompt = $@"
                Generate 5 distinct menu options for the field '{fieldInfo.Name}' in the table '{tableInfo.Name}'.
                Field value: '{fieldValue}'

                Row data:
                {string.Join(", ", rowData.Select(r => $"{r.Key.Split(':')[0]}: {r.Value}"))}

                Recent user queries (avoid generating similar options):
                {string.Join(", ", lastUserQueries.Select(q => $"'{q}'"))}

                Requirements:
                - Each menu option must be unique and not duplicate any other option in meaning or wording.
                - All options must use placeholders in the format '{{field_name}}' for field values from the provided row data, where 'field_name' is the exact key from row data (e.g., '{{{fieldInfo.Name}}}'). Do not modify or add words to the placeholder (e.g., avoid '{{ID}}' or '{{{fieldInfo.Name}_value}}').
                - All options must include '{{{fieldInfo.Name}}}' to reference the value of the field '{fieldInfo.Name}'.
                - The table name '{tableInfo.Name}' should be used to generate contextually relevant options. For example, if the table name includes 'tickets', generate options related to ticket management; if it includes 'deals', generate options related to deal management.
                - The first 3 options must relate specifically to the field '{fieldInfo.Name}' using '{{{fieldInfo.Name}}}' and be relevant to the table's context (e.g., tickets or deals).
                - The 4th option must combine the field '{fieldInfo.Name}' with at least one other non-null field from row data, using '{{{fieldInfo.Name}}}' and another '{{field_name}}' in quotes (e.g., 'View details for {{fieldInfo.Name}} with status \""{{status}}\""'), and be relevant to the table's context.
                - The 5th option must combine the field '{fieldInfo.Name}' with at least two other non-null fields from row data, using '{{{fieldInfo.Name}}}' and other '{{field_name}}' in quotes (e.g., 'Show summary for {{fieldInfo.Name}} with status \""{{status}}\"" and priority \""{{priority}}\""'), and be relevant to the table's context.
                - Do not mention schema information in the options themselves.
                - Options must be meaningful and relevant to the context of the table and field. Only include actions for retrieving or viewing data (e.g., 'get', 'view', 'show'). Do not include actions like 'delete', 'update', or 'add'.
                - Ensure that the generated options are different from the recent user queries provided above.
                - Return the result as a JSON array of exactly 5 unique strings in English.
                - Ensure that '{{field_name}}' placeholders are only from row data and their values are enclosed in quotes within the option text.
                - Do not use the table name in the result options.

                Examples:
                - For a field 'ticketId' in table 'freshdesk_tickets' with row data [ticketId: 123, status: open, priority: high]:
                  - ""View ticket details for {{ticketId}}""
                  - ""Show ticket history for {{ticketId}}""
                  - ""Get ticket summary for {{ticketId}}""
                - For a field 'dealId' in table 'deals' with row data [dealId: 456, amount: 1000, closeDate: 2023-01-01]:
                  - ""View deal details for {{dealId}}""
                  - ""Show deal history for {{dealId}}""
                  - ""Get deal summary for {{dealId}}""

                Output format:
                [""option1"", ""option2"", ""option3"", ""option4"", ""option5""]
            ";

            if (isPrimaryKey)
            {
                prompt += "This field is a primary key.\n";
            }

            return prompt;
        }

        private string BuildPromptForNonExistingField(string fieldName, string fieldValue, IList<MessageModel> lastMessages, IList<RowDataModel> rowData)
        {
            var lastUserQueries = lastMessages.Select(m => m.Text).ToList();

            var prompt = $@"
                Generate 3 distinct menu options based on the row data provided below.
                Row data (excluding fields with null values):
                {string.Join(", ", rowData.Select(r => $"{r.Key.Split(':')[0]}: {r.Value}"))}

                Recent user queries (avoid generating similar options):
                {string.Join(", ", lastUserQueries.Select(q => $"'{q}'"))}

                Requirements:
                - Each menu option must be unique and not duplicate any other option in meaning or wording.
                - All options must use placeholders in the format '{{field_name}}' for field values from the provided row data, where 'field_name' is the exact key from row data (e.g., '{{{fieldName}}}', '{{status}}', '{{company}}'). Do not modify or add words to the placeholder.
                - Each option must include at least one '{{field_name}}' from the row data, prioritizing '{{{fieldName}}}' where relevant, but should reflect the overall context of all fields in the row data.
                - The options should be abstractly related to the collective logic of the row data. For example, if the row data includes fields like total tickets, agent, and company, generate options that explore related aspects like agent performance, company trends, or ticket statistics.
                - Do not use fields with null values in any option.
                - Options must be meaningful and relevant to the context of the row data. Only include actions for retrieving or viewing data (e.g., 'get', 'view', 'show'). Do not include actions like 'delete', 'update', or 'add'.
                - Ensure that the generated options are different from the recent user queries provided above.
                - Return the result as a JSON array of exactly 3 unique strings in English.
                - Ensure '{{field_name}}' placeholders are only from row data.

                Examples:
                - For row data [totalTickets: 50, agent: John, company: Acme]:
                  - ""View ticket statistics for agent {{agent}}""
                  - ""Show ticket trends for company {{company}}""
                  - ""Get summary for {{totalTickets}} tickets""
                - For row data [dealSum: 10000, salesperson: Jane, region: North]:
                  - ""View deal performance for salesperson {{salesperson}}""
                  - ""Show deal trends for region {{region}}""
                  - ""Get statistics for {{dealSum}} deals""

                Output format:
                [""option1"", ""option2"", ""option3""]
            ";

            return prompt;
        }

        public async Task<bool> IsChainBrokenAsync(string query, int chatId)
        {
            var chatHistory = await _chatService.GetChatWithAllIncludeByIdAsync(chatId);

            var allMessages = chatHistory.Messages.OrderBy(m => m.CreatedAt).ToList();

            var recentMessages = allMessages.Skip(Math.Max(0, allMessages.Count - 40)).ToList();

            var historyLines = new List<string>();
            foreach (var msg in recentMessages)
            {
                if (msg.IsUser)
                {
                    historyLines.Add($"User: {msg.Text}");
                }
                else
                {
                    var aiQuestion = msg.FollowUpQuestions ?? "No question"; 
                    historyLines.Add($"AI Question: {aiQuestion}");
                }
            }

            var historyString = string.Join("\n", historyLines);

            var prompt = $@"
                You are an AI assistant that evaluates whether the conversation chain in a chat is broken based on the history of user messages and AI clarifying questions. The chain is broken if the latest message appears to start a new query unrelated to the previous clarifications or refinements, rather than continuing the ongoing conversation thread. Specifically, if the user does not directly answer the AI question (e.g., by providing just the requested details like 'priority and status' or 'sorted by topic desc') but instead rephrases or restates the entire query (e.g., starting with 'Give me...' again), treat this as starting a new query and break the chain, even if it's on the same topic. Break the chain also if the latest message changes the topic, entity, or service entirely (e.g., from tickets to contacts).
                Latest user query: '{query}'
                Conversation history (oldest to newest, most recent last; includes user messages and AI questions):
                {historyString}
                Task:

                Analyze the sequence of user messages and AI questions to determine if the chain is continuous (e.g., each user message directly refines, answers the previous AI question, or continues the thread without restating the full query) or broken (e.g., the latest user message introduces a new, unrelated query, ignores previous clarifications, changes the topic/service, or restates the entire request instead of providing targeted details).
                The chain is continuous only if the user message directly responds to the AI question with concise details (e.g., provides the service name, fields, or sorting without repeating the whole query phrase like 'Give me...').
                If the user restates the full query (e.g., 'Give me 6 tickets from Freshdesk with priority and status' instead of just 'priority and status'), consider it as a new start and break the chain, regardless of whether it's on the same topic.
                Always break the chain if the latest message shifts to a different entity or service (e.g., from 'tickets from Freshdesk' to 'contacts from Apollo').
                Examples of continuous chain:

                'User: give me 5 tickets' -> 'AI Question: Which service?' -> 'User: from freshdesk' -> 'AI Question: Include fields?' -> 'User: include only basic fields' (direct refinements, no full restatement).
                'User: Give me 6 tickets' -> 'AI Question: Which service or additional details for the tickets?' -> 'User: with full fields' (direct addition of details).
                'User: Give me 4 tickets from freshdesk' -> 'AI Question: Which fields or sorting criteria would you like for the Freshdesk tickets?' -> 'User: sorted by topic desc' (direct concise response to the question).

                Examples of broken chain:

                'User: give me 5 tickets' -> 'AI Question: Which service?' -> 'User: from freshdesk' -> 'User: give me 7 contacts' (new unrelated query on different entity).
                'User: Give me 6 tickets' -> 'AI Question: Which service or additional details for the tickets?' -> 'User: with full fields' -> 'AI Question: Which fields from freshdesk_ticket would you like to include, such as status or priority?' -> 'User: Give me 6 tickets from Freshdesk with priority and status fields' (restates full query instead of direct answer like 'priority and status', so broken).
                'User: Give me 6 tickets from Freshdesk with priority and status fields' -> 'AI Question: []' -> 'User: Give me 6 tickets from Freshdesk sorted by updated_at' (new variation with full restatement, broken as it starts anew).
                'User: Give me 4 tickets from freshdesk' -> 'AI Question: Which fields or sorting criteria would you like for the Freshdesk tickets?' -> 'User: Give me 4 tickets from freshdesk sorted by topic desc' (restates full query instead of direct 'sorted by topic desc', so broken).
                'User: Give me 4 tickets from freshdesk' -> 'AI Question: Which fields or sorting criteria would you like for the Freshdesk tickets?' -> 'User: Give me 5 contacts with all fields from Apollo' (full restatement and change of topic/service, broken).

                If the history is empty or only one message, the chain is not broken.
                Return a JSON object with a single key 'is_broken' that is a boolean: true if the chain is broken (latest message starts a new query), false if it continues the chain.

                Output format:
                {{{{""is_broken"""": true/false}}}}
            ";

            var messages = new[] { new UserChatMessage(prompt) };

            var completion = await _chatClient.CompleteChatAsync(messages, new ChatCompletionOptions());

            var responseText = completion.Value.Content.FirstOrDefault()?.Text?.Trim() ?? string.Empty;

            responseText = responseText.Replace("```json", "").Replace("```", "").Trim();

            try
            {
                var jsonResponse = JsonSerializer.Deserialize<Dictionary<string, bool>>(responseText);
                return jsonResponse?["is_broken"] ?? false;
            }
            catch (JsonException)
            {
                return false;
            }
        }

        public async Task<GenerateClarifyingModel> GenerateClarifyingAsync(string userQuery, int chatId)
        {
            var informationForQuery = await _vannaService.ExtractKnowledgeAsync(userQuery);

            if (!string.IsNullOrEmpty(informationForQuery.Error) || !informationForQuery.Ddl.Any())
            {
                return new GenerateClarifyingModel
                {
                    MainGeneratedQuery = string.Empty,
                    Questions = new List<string> { "Your request is unclear or no data found. Can you clarify your request?" },
                    Suggests = new List<string>()
                };
            }

            var ddlInfo = string.Join("\n\n", informationForQuery.Ddl);

            var prompt = $@"
                You are an AI assistant that generates exactly one clarifying question, one main suggested refinement (the most suitable based on the query, DDL, and history), and two diverse additional suggested refinements to resolve ambiguities in a user's natural language query. Use the database schema (DDL) for tables, fields, and services (from table prefixes like 'apollo' for Apollo or 'freshdesk' for Freshdesk), and incorporate the recent chat history to build on previous clarifications, ensure continuity in the conversation chain, and avoid repetition.
                User query: '{userQuery}'
                Database schema (DDL):
                {ddlInfo}
                Task:

                First, evaluate the clarity of the user query using a capping system:

                If the query is understandable (makes sense and relates to DDL): +30 points.
                If a service name is specified (e.g., 'Freshdesk' or 'Apollo'): +30 points.
                If the word 'sort' or equivalent (e.g., 'sorted by', 'order by') is mentioned: +10 points.
                If filtering is mentioned (e.g., word 'where', 'filter by', 'with condition', etc.): +10 points.
                If specific filter conditions are specified (e.g., 'where status is open', 'filter by priority high'): up to +20 points (e.g., 10 per condition mentioned, max 20).
                If specific fields are specified (e.g., 'with priority and status'): up to +20 points (e.g., 10 per field mentioned, max 20).
                If 'basic fields' or 'all fields' is mentioned: +10 points.
                If the main entity (e.g., 'tickets' or 'contacts') maps to only one table in DDL: +50 points.
                If multiple tables exist for the entity (e.g., freshdesk_contacts and apollo_contacts) and no service is specified: +10 points (low score indicates ambiguity).
                Total score: Sum the points. Max possible score: 180. If nonsensical/invalid, score = 0.

                If total score >= 136 (70% clarity, query is sufficiently clear):

                Set clarifying question to empty string.
                Set main suggestion to the original user query (as is, without any changes or additions).
                Generate two diverse suggested refinements as full, complete query phrases that are related to the same table/service or adjacent tables from the same service (e.g., if query is about tickets from Freshdesk, suggest queries about contacts from Freshdesk or variations like top N sorted differently, with different filters, fields, or services for diversity).

                If total score < 136 (ambiguities exist):

                Generate exactly one clarifying question that asks for details on sorting, fields, filtering, or services, referencing specific DDL elements (e.g., 'How would you like to sort the contacts from apollo_contacts?', 'Which fields from freshdesk_tickets would you like to include, such as priority or status?', 'What filtering conditions would you like to apply, such as where status is open?').
                Generate exactly one main suggested refinement and two diverse additional suggested refinements. Each must be a full, complete query phrase that always incorporates the original user query verbatim as its base, always appending additional words in a natural way to resolve ambiguities (e.g., if user query is 'give me 6 tickets', main: 'give me 6 tickets from Freshdesk'). Base them on DDL tables/fields/services, make them varied (e.g., different sorting fields or directions, different fields, different filtering conditions like 'where' clauses, different services), ensure they fit seamlessly into the conversation chain without repeating history.
                The main suggestion must always start with the exact user query and append additional words for the most fitting minimal refinement based on common patterns, history, and DDL to resolve the main ambiguity (e.g., prioritize adding just the service if unspecified, without over-adding extras like sort or filter unless that's the primary missing element; do not add multiple refinements unless necessary).

                If the query is nonsensical/invalid (e.g., 'dfgjdfgklfd', score=0): generate one question to clarify, an empty main suggestion, and no additional suggestions.
                Examples:

                For query 'Give me 5 contacts', Score <136 (e.g., understandable +30, multiple tables +10, no service/sort/fields/filter), Question: 'How would you like to sort or filter the contacts?', Main suggestion: 'Give me 5 contacts from Apollo', Suggestions: ['Give me 5 contacts by username ascending where active is true', 'Give me 5 contacts by email with name and phone fields']
                For query 'Give me 10 tickets', Score <136, Question: 'Which service would you like tickets from, Freshdesk or another?', Main suggestion: 'Give me 10 tickets from Freshdesk', Suggestions: ['Give me 10 tickets from Apollo sorted by status where priority is high', 'Give me 10 tickets with priority and due date fields filtered by open status']
                For query 'Give me 2 contacts', Score <136, Question: 'Which fields or filters should we include from apollo_contacts?', Main suggestion: 'Give me 2 contacts from Apollo with name and email', Suggestions: ['Give me 2 contacts from Apollo phone and creation date where verified is true', 'Give me 2 contacts from Apollo all available fields sorted by name']
                For query 'Give me 6 tickets', Score <136, Question: 'Which service or additional details for the tickets?', Main suggestion: 'Give me 6 tickets from Freshdesk', Suggestions: ['Give me 6 tickets sorted by creation date where status is new', 'Give me 6 tickets with basic fields and detailed request info filtered by high priority']
                For query 'Give me 5 tickets from Freshdesk sorted by creation date where status is open', Score >=136 (understandable +30, service +30, sort +10, filtering +10, specific filter +10, one table +50 =140), Question: '', Main suggestion: 'Give me 5 tickets from Freshdesk sorted by creation date where status is open', Suggestions: ['Give me top 6 contacts from freshdesk_contacts where active is true', 'Give me 5 tickets from Freshdesk with priority and status fields sorted by due date']
                For query 'Give me 5 contacts with basic fields and sort by creation date from apollo', Score >=136 (understandable +30, service +30, sort +10, basic fields +10, one table +50 =130), Question: '', Main suggestion: 'Give me 5 contacts with basic fields and sort by creation date from apollo', Suggestions: ['Give me 5 contacts with name and email fields sorted by name from apollo', 'Give me 5 contacts from apollo where active is true sorted by creation date']
                For nonsensical 'dfgjdfgklfd': Score=0, Question: 'Your query is unclear or no matching data was found. Could you please clarify your request?', Main suggestion: '', Suggestions: []

                Output format:
                {{{{""question"": ""question text"", ""main_suggestion"": ""main suggest text"", ""suggestions"": [""suggest1"", ""suggest2""]}}}}
            ";

            var messages = new[] { new UserChatMessage(prompt) };

            var completion = await _chatClient.CompleteChatAsync(messages, new ChatCompletionOptions());

            var responseText = completion.Value.Content.FirstOrDefault()?.Text?.Trim() ?? string.Empty;

            responseText = responseText.Replace("```json", "").Replace("```", "").Trim();

            try
            {
                var jsonResponse = JsonSerializer.Deserialize<Dictionary<string, object>>(responseText);
                var question = jsonResponse?.TryGetValue("question", out var qObj) == true ? qObj.ToString() : "Your request is unclear or no data found. Can you clarify your request?";
                var mainSuggestion = jsonResponse?.TryGetValue("main_suggestion", out var mObj) == true ? mObj.ToString() : string.Empty;
                var suggestionsJson = jsonResponse?.TryGetValue("suggestions", out var sObj) == true ? sObj.ToString() : "[]";
                var suggestions = JsonSerializer.Deserialize<List<string>>(suggestionsJson) ?? new List<string>();

                return new GenerateClarifyingModel
                {
                    MainGeneratedQuery = mainSuggestion,
                    Questions = string.IsNullOrEmpty(question) ? new List<string>() : new List<string> { question },
                    Suggests = suggestions.Take(2).ToList()
                };
            }
            catch (JsonException)
            {
                return new GenerateClarifyingModel
                {
                    MainGeneratedQuery = string.Empty,
                    Questions = new List<string> { "Your request is unclear or no data found. Can you clarify your request?" },
                    Suggests = new List<string>()
                };
            }
        }

        public async Task<bool> CheckUserQueryInRagSystemAsync(string userQuery)
        {
            var informationForQuery = await _vannaService.ExtractKnowledgeAsync(userQuery);

            return string.IsNullOrEmpty(informationForQuery.Error) && informationForQuery.Ddl.Any();
        }
    }
}