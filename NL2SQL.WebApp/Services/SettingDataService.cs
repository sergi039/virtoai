using AutoMapper;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Setting.Request;
using NL2SQL.WebApp.Models.Setting.Response;
using NL2SQL.WebApp.Models.SqlGenerationRule.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services
{
    public class SettingDataService : ISettingDataService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVannaService _vannaService;

        public SettingDataService(IMapper mapper, IUnitOfWork unitOfWork, IVannaService vannaService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _vannaService = vannaService;
        }

        public async Task<ApolloSettingModel> GetApolloSettingAsync()
        {
            var result = await _unitOfWork.Settings.GetApolloSettingAsync();
            var setting = _mapper.Map<ApolloSettingModel>(result);
            setting.CountRecords = await _unitOfWork.Settings.GetCountRecordsByServiceNameAsync("apollo");
            return setting;
        }

        public async Task<FreshdeskSettingModel> GetFreshdeskSettingAsync()
        {
            var result = await _unitOfWork.Settings.GetFreshdeskSettingAsync();
            var setting = _mapper.Map<FreshdeskSettingModel>(result);
            setting.CountRecords = await _unitOfWork.Settings.GetCountRecordsByServiceNameAsync("freshdesk");
            return setting;
        }

        public async Task<OrttoSettingModel> GetOrttoSettingAsync()
        {
            var result = await _unitOfWork.Settings.GetOrttoSettingAsync();
            var setting = _mapper.Map<OrttoSettingModel>(result);
            setting.CountRecords = await _unitOfWork.Settings.GetCountRecordsByServiceNameAsync("ortto");
            return setting;
        }

        public async Task<PipedriveSettingModel> GetPipedriveSettingAsync()
        {
            var result = await _unitOfWork.Settings.GetPipedriveSettingAsync();
            var setting = _mapper.Map<PipedriveSettingModel>(result);
            setting.CountRecords = await _unitOfWork.Settings.GetCountRecordsByServiceNameAsync("pipedrive");
            return setting;
        }

        public async Task<bool> UpdateApolloSettingAsync(int id, EditApolloSettingModel model)
        {
            var entity = _mapper.Map<ApolloSettingEntity>(model);
            return await _unitOfWork.Settings.UpdateApolloSettingAsync(id, entity);
        }

        public async Task<bool> UpdateLastSyncDataServiceAsync(string nameService, int id, DateTime syncDate, int syncCount)
        {
            var result = await _unitOfWork.Settings.UpdateLastSyncDataServiceAsync(nameService, id, syncDate, syncCount);
            return result;
        }

        public async Task<bool> UpdateFreshdeskSettingAsync(int id, EditFreshdeskSettingModel model)
        {
            var entity = _mapper.Map<FreshdeskSettingEntity>(model);
            return await _unitOfWork.Settings.UpdateFreshdeskSettingAsync(id, entity);
        }

        public async Task<bool> UpdateOrttoSettingAsync(int id, EditOrttoSettingModel model)
        {
            var entity = _mapper.Map<OrttoSettingEntity>(model);
            return await _unitOfWork.Settings.UpdateOrttoSettingAsync(id, entity); ;
        }

        public async Task<bool> UpdatePipedriveSettingAsync(int id, EditPipedriveSettingModel model)
        {
            var entity = _mapper.Map<PipedriveSettingEntity>(model);
            return await _unitOfWork.Settings.UpdatePipedriveSettingAsync(id, entity);
        }

        public async Task<IList<SqlGenerationRuleModel>> GetSqlGenerationRulesAsync()
        {
            var result = await _unitOfWork.SqlGenerationRules.GetAllAsync();
            return _mapper.Map<IList<SqlGenerationRuleModel>>(result);
        }

        public async Task<SqlGenerationRuleModel> UpdateSqlGenerationRuleAsync(int id, EditSqlGenerationRuleModel updatedSqlGenerationRuleModel)
        {
            var sqlGeneratedRuleToUpdate = await _unitOfWork.SqlGenerationRules.GetByIdAsync(id);

            if(sqlGeneratedRuleToUpdate == null)
                throw new KeyNotFoundException($"SQL Generation Rule with ID {id} not found");

            sqlGeneratedRuleToUpdate.Text = updatedSqlGenerationRuleModel.Text;
            sqlGeneratedRuleToUpdate.IsActive = updatedSqlGenerationRuleModel.IsActive;
            sqlGeneratedRuleToUpdate.ServiceTableId = updatedSqlGenerationRuleModel.ServiceTableId;

            await _unitOfWork.SqlGenerationRules.UpdateAsync(sqlGeneratedRuleToUpdate);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return _mapper.Map<SqlGenerationRuleModel>(sqlGeneratedRuleToUpdate);
        }

        public async Task<SqlGenerationRuleModel> CreateSqlGenerationRuleAsync(AddSqlGenerationRuleModel model)
        {
            var sqlGenerationRuleToAdd = new SqlGenerationRuleEntity()
            {
                Text = model.Text,
                IsActive = model.IsActive,
                ServiceTableId = model.ServiceTableId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.SqlGenerationRules.AddAsync(sqlGenerationRuleToAdd);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return _mapper.Map<SqlGenerationRuleModel>(sqlGenerationRuleToAdd);
        }

        public async Task<bool> UpdateActiveStatusByServiceId(int serviceTableId, bool isActive)
        {
            var allRules = await _unitOfWork.SqlGenerationRules.GetAllByServiceTableIdAsync(serviceTableId);

            foreach (var rule in allRules) 
            {
                rule.IsActive = isActive;
                await _unitOfWork.SqlGenerationRules.UpdateAsync(rule);
            }

            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return true;
        }

        public async Task<bool> DeleteSqlGenerationRuleAsync(int id)
        {
            var sqlGenerationRuleToDelete = await _unitOfWork.SqlGenerationRules.GetByIdAsync(id);

            if (sqlGenerationRuleToDelete == null)
                throw new KeyNotFoundException($"SQL Generation Rule with ID {id} not found");

            await _unitOfWork.SqlGenerationRules.DeleteAsync(sqlGenerationRuleToDelete);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return true;
        }
    }
}
