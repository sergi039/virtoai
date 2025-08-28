using NL2SQL.WebApp.Models.Context;

namespace NL2SQL.WebApp.Entities.Context
{
    public class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.ApolloSettings.Any())
            {
                context.ApolloSettings.Add(new ApolloSettingEntity
                {
                    Name = "Apollo",
                    IsActive = true,
                    Tables = "apollo_contact,apollo_freshdesk_mapping,apollo_organization,apollo_pipedrive_mapping",
                    ApiKey = "your Api key",
                    ApiUrl = "url service",
                    SyncDuration = 60,
                    SyncUnit = "minutes",
                    Setup = false,
                    Domain = null,
                    EmailDomain = null,
                    NameUser = null,
                    Limit = 50,
                    MatchFreshdesk = false,
                    MatchPipedrive = false,
                    LastSyncTime = null,
                    LastSyncCount = 0
                });
            }

            if (!context.FreshdeskSettings.Any())
            {
                context.FreshdeskSettings.Add(new FreshdeskSettingEntity
                {
                    Name = "Freshdesk",
                    IsActive = true,
                    Tables = "freshdesk_agent,freshdesk_company,freshdesk_contact,freshdesk_conversation,freshdesk_ticket",
                    ApiKey = "your Api key",
                    ApiUrl = "url service",
                    SyncDuration = 60,
                    SyncUnit = "minutes",
                    Entities = "all",
                    Conversations = false,
                    Since = "",
                    Until = "",
                    BatchSize = 100,
                    Insecure = true,
                    TicketId = null,
                    ParallelThreads = 2,
                    LastSyncTime = null,
                    LastSyncCount = 0
                });
            }

            if (!context.OrttoSettings.Any())
            {
                context.OrttoSettings.Add(new OrttoSettingEntity
                {
                    Name = "Ortto",
                    IsActive = true,
                    Tables = "ortto_activity,ortto_freshdesk_mapping,ortto_organization,ortto_person,ortto_pipedrive_mapping",
                    ApiKey = "your Api key",
                    ApiUrl = "url service",
                    SyncDuration = 60,
                    SyncUnit = "minutes",
                    Setup = false,
                    ImportData = true,
                    Limit = 30,
                    MatchFreshdesk = false,
                    MatchPipedrive = false,
                    LastSyncTime = null,
                    LastSyncCount = 0
                });
            }

            if (!context.PipedriveSettings.Any())
            {
                context.PipedriveSettings.Add(new PipedriveSettingEntity
                {
                    Name = "Pipedrive",
                    IsActive = true,
                    Tables = "pipedrive_deal,pipedrive_contact,pipedrive_activity,pipedrive_freshdesk_contact,pipedrive_organization",
                    ApiKey = null,
                    ApiUrl = null,
                    SyncDuration = 20,
                    SyncUnit = "minutes",
                    Limit = 50,
                    Setup = false,
                    Full = false,
                    MatchFreshdesk = false,
                    Entities = "all",
                    LastSyncTime = null,
                    LastSyncCount = 0
                });
            }

            context.SaveChanges();
        }
    }
}
