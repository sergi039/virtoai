using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Repositories.Interfaces
{
    public interface ISettingDataRepository
    {
        Task<FreshdeskSettingEntity?> GetFreshdeskSettingAsync();
        Task<PipedriveSettingEntity?> GetPipedriveSettingAsync();
        Task<OrttoSettingEntity?> GetOrttoSettingAsync();
        Task<ApolloSettingEntity?> GetApolloSettingAsync();
        Task<int> GetCountRecordsByServiceNameAsync(string nameService);
        Task<bool> UpdateFreshdeskSettingAsync(int id, FreshdeskSettingEntity freshdeskSetting);
        Task<bool> UpdatePipedriveSettingAsync(int id, PipedriveSettingEntity pipedriveSetting);
        Task<bool> UpdateOrttoSettingAsync(int id, OrttoSettingEntity orttoSetting);
        Task<bool> UpdateApolloSettingAsync(int id, ApolloSettingEntity apolloSetting);
        Task<bool> UpdateLastSyncDataServiceAsync(string nameService, int id, DateTime syncDate, int syncCount);
    }
}
