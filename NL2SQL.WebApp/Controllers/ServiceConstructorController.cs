using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.Service.Request;
using NL2SQL.WebApp.Dtos.Service.Response;
using NL2SQL.WebApp.Dtos.ServiceConstructor.Request;
using NL2SQL.WebApp.Dtos.ServiceConstructor.Response;
using NL2SQL.WebApp.Models.Service.Request;
using NL2SQL.WebApp.Models.ServiceConstructor.Request;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/service-constructor")]
    [ApiController]
    public class ServiceConstructorController : ControllerBase
    {
        private readonly IServiceConstructorService _constructorService;
        private readonly IMapper _mapper;

        public ServiceConstructorController(IServiceConstructorService constructorService, IMapper mapper)
        {
            _constructorService = constructorService ??
                                  throw new ArgumentNullException(nameof(constructorService));

            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet("services")]
        public async Task<IActionResult> GetAllServices()
        {
            try
            {
                var resultModel = await _constructorService.GetAllServicesWithFullInfoAsync();

                return Ok(_mapper.Map<IList<ServiceRegistryDto>>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("services/tables/{id}")]
        public async Task<IActionResult> UpdateServiceTableAsync(int id, [FromBody] EditServiceTableDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.UpdateServiceTableAsync(id,
                        _mapper.Map<EditServiceTableModel>(requestDto));

                return Ok(_mapper.Map<ServiceTableDto>(resultModel));
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("services/tables")]
        public async Task<IActionResult> CreateServiceTableAsync([FromBody] AddServiceTableDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.CreateServiceTableAsync(_mapper.Map<AddServiceTableModel>(requestDto));

                return Ok(_mapper.Map<ServiceTableDto>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("services/tables/implicit-relations")]
        public async Task<IActionResult> CreateServiceTableImplicitRelationAsync([FromBody] AddServiceTableImplicitRelationDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.CreateServiceTableImplicitRelationAsync(
                        _mapper.Map<AddServiceTableImplicitRelationModel>(requestDto));

                return Ok(_mapper.Map<ServiceTableImplicitRelationDto>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("services/tables/implicit-relations")]
        public async Task<IActionResult> GetAllServiceTableImplicitRelationsAsync()
        {
            try
            {
                var resultModel = await _constructorService.GetAllServiceTableImplicitRelationsAsync();
                return Ok(_mapper.Map<IList<ServiceTableImplicitRelationDto>>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("services/tables/implicit-relations/{id}")]
        public async Task<IActionResult> DeleteServiceTableImplicitRelationAsync(int id)
        {
            try
            {
                await _constructorService.DeleteServiceTableImplicitRelationAsync(id);
                return Ok(true);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("services/tables")]
        public async Task<IActionResult> GetAllServiceTablesAsync()
        {
            try
            {
                var resultModel = await _constructorService.GetAllServiceTablesAsync();
                return Ok(_mapper.Map<IList<ServiceTableDto>>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("services/tables/{id}")]
        public async Task<IActionResult> DeleteServiceTableAsync(int id)
        {
            try
            {
                await _constructorService.DeleteServiceTableAsync(id);
                return Ok(true);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("services/{registryId}/tables")]
        public async Task<IActionResult> GetServiceTablesByServiceRegistryIdAsync(int registryId)
        {
            try
            {
                var resultModel = await _constructorService.GetServiceTablesByServiceRegistryIdAsync(registryId);

                return Ok(_mapper.Map<IList<ServiceTableDto>>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("services/tables/fields")]
        public async Task<IActionResult> CreateServiceTableFieldAsync([FromBody] AddServiceTableFieldDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.CreateServiceTableFieldAsync(
                        _mapper.Map<AddServiceTableFieldModel>(requestDto));

                return Ok(_mapper.Map<ServiceTableFieldDto>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("services/tables/with_fields")]
        public async Task<IActionResult> GetAllServiceTableWithFieldsAsync()
        {
            try
            {
                var resultModel = await _constructorService.GetAllServiceTablesWithServiceTableFieldsAsync();
                return Ok(_mapper.Map<IList<ServiceTableDto>>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("services/tables/fields")]
        public async Task<IActionResult> GetAllServiceTableFieldsWithContextMenuAsync()
        {
            try
            {
                var resultModel = await _constructorService.GetAllServiceTableFieldsWithContextMenuAsync();
                return Ok(_mapper.Map<IList<ServiceTableFieldDto>>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("services/tables/fields/{id}")]
        public async Task<IActionResult> DeleteServiceTableFieldAsync(int id)
        {
            try
            {
                await _constructorService.DeleteServiceTableFieldAsync(id);
                return Ok(true);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("services/tables/fields/{id}")]
        public async Task<IActionResult> UpdateServiceTableFieldAsync(int id, [FromBody] EditServiceTableFieldDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.UpdateServiceTableFieldAsync(id,
                        _mapper.Map<EditServiceTableFieldModel>(requestDto));

                return Ok(_mapper.Map<ServiceTableFieldDto>(resultModel));
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("services/tables/fields/context-menu-items")]
        public async Task<IActionResult> CreateServiceTableFieldContextMenuItemAsync([FromBody] AddFieldContextMenuItemDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.CreateContextMenuItemAsync(
                        _mapper.Map<AddFieldContextMenuItemModel>(requestDto));

                return Ok(_mapper.Map<FieldContextMenuItemDto>(resultModel));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("services/tables/fields/context-menu-items/{id}")]
        public async Task<IActionResult> DeleteServiceTableFieldContextMenuItemAsync(int id)
        {
            try
            {
                await _constructorService.DeleteContextMenuItemAsync(id);
                return Ok(true);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("services/tables/fields/context-menu-items/{id}")]
        public async Task<IActionResult> UpdateServiceTableFieldContextMenuItemAsync(int id, [FromBody] EditFieldContextMenuItemDto requestDto)
        {
            try
            {
                var resultModel = await _constructorService.UpdateContextMenuItemAsync(id,
                        _mapper.Map<EditFieldContextMenuItemModel>(requestDto));

                return Ok(_mapper.Map<FieldContextMenuItemDto>(resultModel));
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
