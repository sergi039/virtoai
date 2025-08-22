using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.Setting.Request;
using NL2SQL.WebApp.Dtos.Setting.Response;
using NL2SQL.WebApp.Models.Apollo.Request;
using NL2SQL.WebApp.Models.Freshdesk.Request;
using NL2SQL.WebApp.Models.Ortto.Request;
using NL2SQL.WebApp.Models.Pipedrive.Request;
using NL2SQL.WebApp.Models.Setting.Request;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/settings")]
    [ApiController]
    [Authorize]
    public class SettingDataController : ControllerBase
    {
        private readonly ISettingDataService _settingDataService;
        private readonly IOrttoImportService _orttoImportService;
        private readonly IPipedriveImportService _pipedriveImportService;
        private readonly IApolloImportService _apolloImportService;
        private readonly IFreshdeskImportService _freshdeskImportService;

        private readonly IMapper _mapper;

        public SettingDataController(IApolloImportService apolloImportService,
            IPipedriveImportService pipedriveImportService, ISettingDataService settingDataService, IMapper mapper,
            IOrttoImportService orttoImportService, IFreshdeskImportService freshdeskImportService)
        {
            _settingDataService = settingDataService;
            _orttoImportService = orttoImportService;
            _pipedriveImportService = pipedriveImportService;
            _apolloImportService = apolloImportService;
            _mapper = mapper;
            _freshdeskImportService = freshdeskImportService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSettings()
        {
            var result = new GeneralSettingDto
            {
                FreshdeskSetting = _mapper.Map<FreshdeskSettingDto>(await _settingDataService.GetFreshdeskSettingAsync()),
                PipedriveSetting = _mapper.Map<PipedriveSettingDto>(await _settingDataService.GetPipedriveSettingAsync()),
                OrttoSetting = _mapper.Map<OrttoSettingDto>(await _settingDataService.GetOrttoSettingAsync()),
                ApolloSetting = _mapper.Map<ApolloSettingDto>(await _settingDataService.GetApolloSettingAsync())
            };

            return Ok(result);
        }

        [HttpGet("sql-generation-rules")]
        public async Task<IActionResult> GetSqlGenerationRules()
        {
            var rulesModels = await _settingDataService.GetSqlGenerationRulesAsync();

            var rules = _mapper.Map<IList<SqlGenerationRuleDto>>(rulesModels);

            return Ok(rules);
        }

        [HttpPost("sql-generation-rules")]
        public async Task<IActionResult> CreateSqlGenerationRule([FromBody] AddSqlGenerationRuleDto requestDto)
        {
            try
            {
                var ruleToAddModel = _mapper.Map<AddSqlGenerationRuleModel>(requestDto);

                var ruleCreatedModel = await _settingDataService.CreateSqlGenerationRuleAsync(ruleToAddModel);

                var resultDto = _mapper.Map<SqlGenerationRuleDto>(ruleCreatedModel);

                return Ok(resultDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("sql-generation-rules/{id}")]
        public async Task<IActionResult> DeleteSqlGenerationRule(int id)
        {
            try
            {
                await _settingDataService.DeleteSqlGenerationRuleAsync(id);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("sql-generation-rules/{id}")]
        public async Task<IActionResult> UpdateSqlGenerationRule(int id, [FromBody] EditSqlGenerationRuleDto requestDto)
        {
            try
            {
                var ruleToUpdateModel = _mapper.Map<EditSqlGenerationRuleModel>(requestDto);

                var ruleUpdatedModel = await _settingDataService.UpdateSqlGenerationRuleAsync(id, ruleToUpdateModel);

                var resultDto = _mapper.Map<SqlGenerationRuleDto>(ruleUpdatedModel);

                return Ok(resultDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateGeneralSettings([FromBody] EditGeneralSettingDto requestDto)
        {
            var pipedriveSettingModel = _mapper.Map<EditPipedriveSettingModel>(requestDto.PipedriveSetting);
            var orttoSettingModel = _mapper.Map<EditOrttoSettingModel>(requestDto.OrttoSetting);
            var freshdeskSettingModel = _mapper.Map<EditFreshdeskSettingModel>(requestDto.FreshdeskSetting);
            var apolloSettingModel = _mapper.Map<EditApolloSettingModel>(requestDto.ApolloSetting);

            var resultUpdatePipedrive =
                await _settingDataService.UpdatePipedriveSettingAsync(pipedriveSettingModel.Id, pipedriveSettingModel);
            var resultUpdateOrtto =
                await _settingDataService.UpdateOrttoSettingAsync(orttoSettingModel.Id, orttoSettingModel);
            var resultUpdateFreshdesk =
                await _settingDataService.UpdateFreshdeskSettingAsync(freshdeskSettingModel.Id, freshdeskSettingModel);
            var resultUpdateApollo =
                await _settingDataService.UpdateApolloSettingAsync(apolloSettingModel.Id, apolloSettingModel);

            if (resultUpdatePipedrive && resultUpdateOrtto && resultUpdateFreshdesk && resultUpdateApollo)
                return Ok(true);
            else
                return BadRequest(false);
        }

        [HttpPost("ortto/sync")]
        public async Task<IActionResult> SyncOrttoData([FromBody] OrttoSettingDto requestDto)
        {
            var optionsOrtto = _mapper.Map<OrttoImportOptionsModel>(requestDto);
            var result = await _orttoImportService.ImportOrttoDataAsync(optionsOrtto);

            if (result.IsImporting)
                await _settingDataService.UpdateLastSyncDataServiceAsync("Ortto", requestDto.Id, DateTime.UtcNow, result.TotalRecords);

            return Ok(result.IsImporting);
        }

        [HttpPost("pipedrive/sync")]
        public async Task<IActionResult> SyncPipedriveData([FromBody] PipedriveSettingDto requestDto)
        {
            var optionsPipedrive = _mapper.Map<PipedriveImportOptionsModel>(requestDto);
            var result = await _pipedriveImportService.ImportPipedriveDataAsync(optionsPipedrive);

            if (result.IsImporting)
                await _settingDataService.UpdateLastSyncDataServiceAsync("Pipedrive", requestDto.Id, DateTime.UtcNow, result.TotalRecords);

            return Ok(result.IsImporting);
        }

        [HttpPost("apollo/sync")]
        public async Task<IActionResult> SyncApolloData([FromBody] ApolloSettingDto requestDto)
        {
            var optionsApollo = _mapper.Map<ApolloImportOptionsModel>(requestDto);
            var result = await _apolloImportService.ImportApolloDataAsync(optionsApollo);

            if (result.IsImporting)
                await _settingDataService.UpdateLastSyncDataServiceAsync("Apollo", requestDto.Id, DateTime.UtcNow, result.TotalRecords);

            return Ok(result.IsImporting);
        }

        [HttpPost("freshdesk/sync")]
        public async Task<IActionResult> SyncFreshdeskData([FromBody] FreshdeskSettingDto requestDto)
        {
            var optionsFreshdesk = _mapper.Map<FreshdeskImportOptionsModel>(requestDto);
            var result = await _freshdeskImportService.FetchAndImportAllDataAsync(optionsFreshdesk);

            if (result.IsImporting)
                await _settingDataService.UpdateLastSyncDataServiceAsync("Freshdesk", requestDto.Id, DateTime.UtcNow, result.TotalRecords);

            return Ok(result.IsImporting);
        }
    }
}
