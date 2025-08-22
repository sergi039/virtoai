using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Entities.Enums;
using NL2SQL.WebApp.Extensions;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories
{
    public class SettingDataRepository : ISettingDataRepository
    {
        private readonly AppDbContext _context;

        public SettingDataRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<ApolloSettingEntity?> GetApolloSettingAsync()
        {
            var result = await _context.ApolloSettings.FirstOrDefaultAsync();
            return result;
        }

        public async Task<FreshdeskSettingEntity?> GetFreshdeskSettingAsync()
        {
            var result = await _context.FreshdeskSettings.FirstOrDefaultAsync();
            return result;
        }

        public async Task<OrttoSettingEntity?> GetOrttoSettingAsync()
        {
            var result = await _context.OrttoSettings.FirstOrDefaultAsync();
            return result;
        }

        public async Task<PipedriveSettingEntity?> GetPipedriveSettingAsync()
        {
            var result = await _context.PipedriveSettings.FirstOrDefaultAsync();
            return result;
        }

        public async Task<bool> UpdateApolloSettingAsync(int id, ApolloSettingEntity apolloSetting)
        {
            var existApolloSetting = await _context.ApolloSettings.FirstOrDefaultAsync(x => x.Id == id);

            if (existApolloSetting == null)
                return false;

            existApolloSetting.Name = apolloSetting.Name;
            existApolloSetting.IsActive = apolloSetting.IsActive;
            existApolloSetting.Tables = apolloSetting.Tables;
            existApolloSetting.Setup = apolloSetting.Setup;
            existApolloSetting.Domain = apolloSetting.Domain;
            existApolloSetting.ApiKey = apolloSetting.ApiKey;
            existApolloSetting.ApiUrl = apolloSetting.ApiUrl;
            existApolloSetting.EmailDomain = apolloSetting.EmailDomain;
            existApolloSetting.NameUser = apolloSetting.NameUser;
            existApolloSetting.Limit = apolloSetting.Limit;
            existApolloSetting.SyncDuration = apolloSetting.SyncDuration;
            existApolloSetting.SyncUnit = apolloSetting.SyncUnit;
            existApolloSetting.MatchFreshdesk = apolloSetting.MatchFreshdesk;
            existApolloSetting.MatchPipedrive = apolloSetting.MatchPipedrive;

            _context.ApolloSettings.Update(existApolloSetting);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateLastSyncDataServiceAsync(string nameService, int id, DateTime syncDate, int syncCount)
        {
            if (nameService == DatabaseServiceName.Pipedrive.GetDescription())
            {
                var existPipedriveSetting = await _context.PipedriveSettings.FirstOrDefaultAsync(x => x.Id == id);

                if (existPipedriveSetting == null)
                    return false;

                existPipedriveSetting.LastSyncTime = syncDate;
                existPipedriveSetting.LastSyncCount = syncCount;

                _context.PipedriveSettings.Update(existPipedriveSetting);
            }
            else if (nameService == DatabaseServiceName.Apollo.GetDescription())
            {
                var existApolloSetting = await _context.ApolloSettings.FirstOrDefaultAsync(x => x.Id == id);

                if (existApolloSetting == null)
                    return false;

                existApolloSetting.LastSyncTime = syncDate;
                existApolloSetting.LastSyncCount = syncCount;

                _context.ApolloSettings.Update(existApolloSetting);
            }
            else if (nameService == DatabaseServiceName.Ortto.GetDescription())
            {
                var existOrttoSetting = await _context.OrttoSettings.FirstOrDefaultAsync(x => x.Id == id);

                if (existOrttoSetting == null)
                    return false;

                existOrttoSetting.LastSyncTime = syncDate;
                existOrttoSetting.LastSyncCount = syncCount;

                _context.OrttoSettings.Update(existOrttoSetting); 
            }
            else if (nameService == DatabaseServiceName.Freshdesk.GetDescription())
            {
                var existFreshdeskSetting = await _context.FreshdeskSettings.FirstOrDefaultAsync(x => x.Id == id);

                if (existFreshdeskSetting == null)
                    return false;

                existFreshdeskSetting.LastSyncTime = syncDate;
                existFreshdeskSetting.LastSyncCount = syncCount;

                _context.FreshdeskSettings.Update(existFreshdeskSetting);
            }
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateFreshdeskSettingAsync(int id, FreshdeskSettingEntity freshdeskSetting)
        {
            var existFreshdeskSetting = await _context.FreshdeskSettings.FirstOrDefaultAsync(x => x.Id == id);

            if (existFreshdeskSetting == null)
                return false;

            existFreshdeskSetting.Name = freshdeskSetting.Name;
            existFreshdeskSetting.IsActive = freshdeskSetting.IsActive;
            existFreshdeskSetting.Tables = freshdeskSetting.Tables;
            existFreshdeskSetting.Entities = freshdeskSetting.Entities;
            existFreshdeskSetting.Conversations = freshdeskSetting.Conversations;
            existFreshdeskSetting.Since = freshdeskSetting.Since;
            existFreshdeskSetting.ApiKey = freshdeskSetting.ApiKey;
            existFreshdeskSetting.ApiUrl = freshdeskSetting.ApiUrl;
            existFreshdeskSetting.SyncDuration = freshdeskSetting.SyncDuration;
            existFreshdeskSetting.SyncUnit = freshdeskSetting.SyncUnit;
            existFreshdeskSetting.Until = freshdeskSetting.Until;
            existFreshdeskSetting.BatchSize = freshdeskSetting.BatchSize;
            existFreshdeskSetting.Insecure = freshdeskSetting.Insecure;
            existFreshdeskSetting.TicketId = freshdeskSetting.TicketId;
            existFreshdeskSetting.ParallelThreads = freshdeskSetting.ParallelThreads;

            _context.FreshdeskSettings.Update(existFreshdeskSetting);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateOrttoSettingAsync(int id, OrttoSettingEntity orttoSetting)
        {
            var existOrttoSetting = await _context.OrttoSettings.FirstOrDefaultAsync(x => x.Id == id);

            if (existOrttoSetting == null)
                return false;

            existOrttoSetting.Name = orttoSetting.Name;
            existOrttoSetting.IsActive = orttoSetting.IsActive;
            existOrttoSetting.Tables = orttoSetting.Tables;
            existOrttoSetting.Setup = orttoSetting.Setup;
            existOrttoSetting.ApiKey = orttoSetting.ApiKey;
            existOrttoSetting.ApiUrl = orttoSetting.ApiUrl;
            existOrttoSetting.SyncDuration = orttoSetting.SyncDuration;
            existOrttoSetting.SyncUnit = orttoSetting.SyncUnit;
            existOrttoSetting.ImportData = orttoSetting.ImportData;
            existOrttoSetting.Limit = orttoSetting.Limit;
            existOrttoSetting.MatchFreshdesk = orttoSetting.MatchFreshdesk;
            existOrttoSetting.MatchPipedrive = orttoSetting.MatchPipedrive;

            _context.OrttoSettings.Update(existOrttoSetting);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdatePipedriveSettingAsync(int id, PipedriveSettingEntity pipedriveSetting)
        {
            var existPipedriveSetting = await _context.PipedriveSettings.FirstOrDefaultAsync(x => x.Id == id);

            if (existPipedriveSetting == null)
                return false;

            existPipedriveSetting.Name = pipedriveSetting.Name;
            existPipedriveSetting.IsActive = pipedriveSetting.IsActive;
            existPipedriveSetting.Tables = pipedriveSetting.Tables;
            existPipedriveSetting.SyncDuration = pipedriveSetting.SyncDuration;
            existPipedriveSetting.ApiKey = pipedriveSetting.ApiKey;
            existPipedriveSetting.ApiUrl = pipedriveSetting.ApiUrl;
            existPipedriveSetting.SyncUnit = pipedriveSetting.SyncUnit;
            existPipedriveSetting.Entities = pipedriveSetting.Entities;
            existPipedriveSetting.Limit = pipedriveSetting.Limit;
            existPipedriveSetting.Setup = pipedriveSetting.Setup;
            existPipedriveSetting.Full = pipedriveSetting.Full;
            existPipedriveSetting.MatchFreshdesk = pipedriveSetting.MatchFreshdesk;

            _context.PipedriveSettings.Update(existPipedriveSetting);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<int> GetCountRecordsByServiceNameAsync(string nameService)
        {
            var count = 0;

            switch (nameService)
            {
                case "apollo":
                    count += await _context.ApolloContacts.CountAsync();
                    count += await _context.ApolloOrganizations.CountAsync();
                    break;
                case "ortto":
                    count += await _context.OrttoActivities.CountAsync();
                    count += await _context.OrttoOrganizations.CountAsync();
                    count += await _context.OrttoPersons.CountAsync();
                    break;
                case "pipedrive":
                    count += await _context.PipedriveContacts.CountAsync();
                    count += await _context.PipedriveDeals.CountAsync();
                    count += await _context.PipedriveOrganizations.CountAsync();
                    count += await _context.PipedriveActivities.CountAsync();
                    break;
                case "freshdesk":
                    count += await _context.FreshdeskContacts.CountAsync();
                    count += await _context.FreshdeskCompanies.CountAsync();
                    count += await _context.FreshdeskTickets.CountAsync();
                    count += await _context.FreshdeskConversations.CountAsync();
                    break;
            }

            return count;
        }
    }
}
