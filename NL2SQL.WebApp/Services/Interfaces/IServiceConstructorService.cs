using NL2SQL.WebApp.Models.Service.Request;
using NL2SQL.WebApp.Models.Service.Response;
using NL2SQL.WebApp.Models.ServiceConstructor.Request;
using NL2SQL.WebApp.Models.ServiceConstructor.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IServiceConstructorService
    {
        Task<IList<ServiceRegistryModel>> GetAllServicesWithFullInfoAsync();

        Task<IList<ServiceTableModel>> GetServiceTablesByServiceRegistryIdAsync(int registryId);

        Task<IList<ServiceTableModel>> GetAllServiceTablesAsync();

        Task<IList<ServiceTableModel>> GetAllServiceTablesWithServiceTableFieldsAsync();

        Task<IList<ServiceTableImplicitRelationModel>> GetAllServiceTableImplicitRelationsAsync();

        Task DeleteServiceTableAsync(int id);

        Task<ServiceTableModel> CreateServiceTableAsync(AddServiceTableModel model);

        Task<ServiceTableModel> UpdateServiceTableAsync(int id, EditServiceTableModel model);

        Task<IList<ServiceTableFieldModel>> GetAllServiceTableFieldsAsync();

        Task<IList<ServiceTableFieldModel>> GetAllServiceTableFieldsWithContextMenuAsync();

        Task<ServiceTableFieldModel> CreateServiceTableFieldAsync(AddServiceTableFieldModel model);

        Task<ServiceTableImplicitRelationModel> CreateServiceTableImplicitRelationAsync(AddServiceTableImplicitRelationModel model);

        Task<ServiceTableFieldModel> UpdateServiceTableFieldAsync(int id, EditServiceTableFieldModel model);

        Task DeleteServiceTableFieldAsync(int id);

        Task DeleteServiceTableImplicitRelationAsync(int id);

        Task<FieldContextMenuItemModel> CreateContextMenuItemAsync(AddFieldContextMenuItemModel model);

        Task<FieldContextMenuItemModel> UpdateContextMenuItemAsync(int id, EditFieldContextMenuItemModel model);

        Task DeleteContextMenuItemAsync(int id);
    }
}
