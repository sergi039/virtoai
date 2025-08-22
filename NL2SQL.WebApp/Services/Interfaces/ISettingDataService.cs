using NL2SQL.WebApp.Models.Setting.Request;
using NL2SQL.WebApp.Models.Setting.Response;
using NL2SQL.WebApp.Models.SqlGenerationRule.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface ISettingDataService
    {
        Task<PipedriveSettingModel> GetPipedriveSettingAsync();
        Task<OrttoSettingModel> GetOrttoSettingAsync();
        Task<FreshdeskSettingModel> GetFreshdeskSettingAsync();
        Task<ApolloSettingModel> GetApolloSettingAsync();
        Task<IList<SqlGenerationRuleModel>> GetSqlGenerationRulesAsync();
        Task<SqlGenerationRuleModel> UpdateSqlGenerationRuleAsync(int id, EditSqlGenerationRuleModel model);
        Task<SqlGenerationRuleModel> CreateSqlGenerationRuleAsync(AddSqlGenerationRuleModel model);
        Task<bool> UpdateActiveStatusByServiceId(int serviceTableId, bool isActive);
        Task<bool> DeleteSqlGenerationRuleAsync(int id);
        Task<bool> UpdatePipedriveSettingAsync(int id, EditPipedriveSettingModel model);
        Task<bool> UpdateOrttoSettingAsync(int id, EditOrttoSettingModel model);
        Task<bool> UpdateFreshdeskSettingAsync(int id, EditFreshdeskSettingModel model);
        Task<bool> UpdateApolloSettingAsync(int id, EditApolloSettingModel model);
        Task<bool> UpdateLastSyncDataServiceAsync(string nameService, int id, DateTime syncDate, int syncCount);
    }
}
