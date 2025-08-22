using AutoMapper;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Service.Request;
using NL2SQL.WebApp.Models.Service.Response;
using NL2SQL.WebApp.Models.ServiceConstructor.Request;
using NL2SQL.WebApp.Models.ServiceConstructor.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services
{
    public class ServiceConstructorService : IServiceConstructorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IVannaService _vannaService;
        private readonly ISettingDataService _settingDataService;

        public ServiceConstructorService(IUnitOfWork unitOfWork, IMapper mapper, IVannaService vannaService, ISettingDataService settingDataService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _vannaService = vannaService ?? throw new ArgumentNullException(nameof(vannaService));
            _settingDataService = settingDataService ?? throw new ArgumentNullException(nameof(settingDataService));
        }

        public async Task<ServiceTableModel> CreateServiceTableAsync(AddServiceTableModel model)
        {
            var serviceTableToCreate = new ServiceTableEntity()
            {
                Name = model.Name,
                IsActive = model.IsActive,
                ServiceRegistryEntityId = model.ServiceRegistryEntityId
            };

            await _unitOfWork.ServiceTables.AddAsync(serviceTableToCreate);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return _mapper.Map<ServiceTableModel>(serviceTableToCreate);
        }

        public async Task<ServiceTableFieldModel> CreateServiceTableFieldAsync(AddServiceTableFieldModel model)
        {
            var serviceTableFieldToCreate = new ServiceTableFieldEntity()
            {
                Name = model.Name,
                DisplayName = model.DisplayName,
                IsHidden = model.IsHidden,
                ServiceTableId = model.ServiceTableId,
                IsAiContextGenerationEnabled = model.IsAiContextGenerationEnabled,
                UrlTemplate = model.UrlTemplate
            };

            await _unitOfWork.ServiceTableFields.AddAsync(serviceTableFieldToCreate);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return _mapper.Map<ServiceTableFieldModel>(serviceTableFieldToCreate);
        }

        public async Task<ServiceTableImplicitRelationModel> CreateServiceTableImplicitRelationAsync(AddServiceTableImplicitRelationModel model)
        {
            var serviceTableImplicitRelationToCreate = new ServiceTableImplicitRelationEntity()
            {
                PrimaryTableColumn = model.PrimaryTableColumn,
                RelatedServiceTableId = model.RelatedServiceTableId,
                RelatedTableColumn = model.RelatedTableColumn,
                ServiceTableId = model.ServiceTableId,
                RelationType = model.RelationType,
                SqlGenerationRuleId = model.SqlGenerationRuleId
            };

            await _unitOfWork.ImplicitRelations.AddAsync(serviceTableImplicitRelationToCreate);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ServiceTableImplicitRelationModel>(serviceTableImplicitRelationToCreate);
        }


        public async Task<IList<ServiceTableImplicitRelationModel>> GetAllServiceTableImplicitRelationsAsync()
        {
            var serviceTableImplicitRelations = await _unitOfWork.ImplicitRelations.GetAllAsync();
            return _mapper.Map<IList<ServiceTableImplicitRelationModel>>(serviceTableImplicitRelations);
        }

        public async Task DeleteServiceTableAsync(int id)
        {
            var serviceTableToDelete = await _unitOfWork.ServiceTables.GetByIdAsync(id);

            if (serviceTableToDelete == null)
                throw new KeyNotFoundException($"Service table with ID {id} not found");

            await _unitOfWork.ServiceTables.DeleteAsync(serviceTableToDelete);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();
        }

        public async Task DeleteServiceTableFieldAsync(int id)
        {
            var serviceTableFieldToDelete = await _unitOfWork.ServiceTableFields.GetByIdAsync(id);

            if (serviceTableFieldToDelete == null)
                throw new KeyNotFoundException($"Service table field with ID {id} not found");

            await _unitOfWork.ServiceTableFields.DeleteAsync(serviceTableFieldToDelete);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();
        }

        public async Task DeleteServiceTableImplicitRelationAsync(int id)
        {
            var serviceTableImplicitRelationToDelete = await _unitOfWork.ImplicitRelations.GetByIdAsync(id);

            if (serviceTableImplicitRelationToDelete == null)
                throw new KeyNotFoundException($"Service table implicit relation with ID {id} not found");

            await _unitOfWork.ImplicitRelations.DeleteAsync(serviceTableImplicitRelationToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IList<ServiceTableFieldModel>> GetAllServiceTableFieldsAsync()
        {
            var result = await _unitOfWork.ServiceTableFields.GetAllAsync();
            return _mapper.Map<IList<ServiceTableFieldModel>>(result);
        }

        public async Task<IList<ServiceTableModel>> GetAllServiceTablesAsync()
        {
            var result = await _unitOfWork.ServiceTables.GetAllAsync();
            return _mapper.Map<IList<ServiceTableModel>>(result);
        }

        public async Task<IList<ServiceTableModel>> GetAllServiceTablesWithServiceTableFieldsAsync()
        {
            var result = await _unitOfWork.ServiceTables.GetAllWithServiceTableFieldsAsync();
            return _mapper.Map<IList<ServiceTableModel>>(result);
        }

        public async Task<IList<ServiceRegistryModel>> GetAllServicesWithFullInfoAsync()
        {
            var result = await _unitOfWork.ServiceRegistries.GetAllWithIncludeAllAsync();
            return _mapper.Map<IList<ServiceRegistryModel>>(result);
        }

        public async Task<IList<ServiceTableModel>> GetServiceTablesByServiceRegistryIdAsync(int registryId)
        {
            var result = await _unitOfWork.ServiceRegistries.GetServiceTablesByServiceRegistryIdAsync(registryId);
            return _mapper.Map<IList<ServiceTableModel>>(result);
        }

        public async Task<ServiceTableModel> UpdateServiceTableAsync(int id, EditServiceTableModel model)
        {
            var serviceTableToUpdate = await _unitOfWork.ServiceTables.GetByIdAsync(id);

            if (serviceTableToUpdate == null)
                throw new KeyNotFoundException($"Service table with ID {id} not found");

            var oldStatusActive = serviceTableToUpdate.IsActive;
            var newStatusActive = model.IsActive;

            serviceTableToUpdate.Name = model.Name;
            serviceTableToUpdate.IsActive = newStatusActive;
            serviceTableToUpdate.ServiceRegistryEntityId = model.ServiceRegistryEntityId;

            await _unitOfWork.ServiceTables.UpdateAsync(serviceTableToUpdate);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            if (oldStatusActive != newStatusActive)
                await _settingDataService.UpdateActiveStatusByServiceId(id, model.IsActive);

            return _mapper.Map<ServiceTableModel>(serviceTableToUpdate);
        }

        public async Task<ServiceTableFieldModel> UpdateServiceTableFieldAsync(int id, EditServiceTableFieldModel model)
        {
            var serviceTableFieldToUpdate = await _unitOfWork.ServiceTableFields.GetByIdWithContextMenuAsync(id);

            if (serviceTableFieldToUpdate == null)
                throw new KeyNotFoundException($"Service table field with ID {id} not found");

            serviceTableFieldToUpdate.Name = model.Name;
            serviceTableFieldToUpdate.DisplayName = model.DisplayName;
            serviceTableFieldToUpdate.IsHidden = model.IsHidden;
            serviceTableFieldToUpdate.UrlTemplate = model.UrlTemplate;
            serviceTableFieldToUpdate.IsAiContextGenerationEnabled = model.IsAiContextGenerationEnabled;

            await _unitOfWork.ServiceTableFields.UpdateAsync(serviceTableFieldToUpdate);
            await _unitOfWork.CompleteAsync();
            _vannaService.ReinitializeModels();

            return _mapper.Map<ServiceTableFieldModel>(serviceTableFieldToUpdate);
        }

        public async Task<FieldContextMenuItemModel> CreateContextMenuItemAsync(AddFieldContextMenuItemModel model)
        {
            var fieldContextMenuItemToCreate = new ServiceTableFieldContextMenuItemEntity()
            {
                Name = model.Name,
                ServiceTableFieldId = model.ServiceTableFieldId,
                SortOrder = model.SortOrder
            };

            await _unitOfWork.ContextMenuItems.AddAsync(fieldContextMenuItemToCreate);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<FieldContextMenuItemModel>(fieldContextMenuItemToCreate);
        }

        public async Task<FieldContextMenuItemModel> UpdateContextMenuItemAsync(int id, EditFieldContextMenuItemModel model)
        {
            var fieldContextMenuItemToUpdate = await _unitOfWork.ContextMenuItems.GetByIdAsync(id);

            if (fieldContextMenuItemToUpdate == null)
                throw new KeyNotFoundException($"Context menu item with ID {id} not found");

            fieldContextMenuItemToUpdate.Name = model.Name;
            fieldContextMenuItemToUpdate.SortOrder = model.SortOrder;

            await _unitOfWork.ContextMenuItems.UpdateAsync(fieldContextMenuItemToUpdate);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<FieldContextMenuItemModel>(fieldContextMenuItemToUpdate);
        }

        public async Task DeleteContextMenuItemAsync(int id)
        {
            var fieldContextMenuItemToDelete = await _unitOfWork.ContextMenuItems.GetByIdAsync(id);

            if (fieldContextMenuItemToDelete == null)
                throw new KeyNotFoundException($"Context menu item with ID {id} not found");

            await _unitOfWork.ContextMenuItems.DeleteAsync(fieldContextMenuItemToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IList<ServiceTableFieldModel>> GetAllServiceTableFieldsWithContextMenuAsync()
        {
            var result = await _unitOfWork.ServiceTableFields.GetAllWithContextMenuAsync();
            return _mapper.Map<IList<ServiceTableFieldModel>>(result);
        }
    }
}
