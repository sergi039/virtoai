using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.AiGenerate.Response;
using NL2SQL.WebApp.Dtos.FieldContext.Request;
using NL2SQL.WebApp.Dtos.Message.Request;
using NL2SQL.WebApp.Dtos.Message.Response;
using NL2SQL.WebApp.Models.AiGenerate.Request;
using NL2SQL.WebApp.Services.Interfaces;
using NL2SQL.WebApp.Utils;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/ai-generate")]
    [ApiController]
    public class AiGenerateController : ControllerBase
    {
        private readonly IOpenAiApiService _openAiApiService;
        private readonly ISqlQueryService _sqlQueryService;
        private readonly IMapper _mapper;

        public AiGenerateController(IOpenAiApiService openAiApiService, IMapper mapper, ISqlQueryService sqlQueryService)
        {
            _openAiApiService = openAiApiService ?? throw new ArgumentNullException(nameof(openAiApiService), "OpenAI API service cannot be null.");
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper), "Mapper cannot be null.");
            _sqlQueryService = sqlQueryService ?? throw new ArgumentNullException(nameof(sqlQueryService), "SQL Query service cannot be null.");
        }

        [HttpPost("generate-field-context")]
        public async Task<IActionResult> GenerateFieldContext([FromBody] RequestGenerateFieldContextDto requestDto)
        {
            try
            {
                var requestModel = _mapper.Map<RequestGenerateFieldContextModel>(requestDto);

                var response = await _openAiApiService.GenerateFieldContextAsync(requestModel);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("check-broke-chain")]
        public async Task<IActionResult> IsChainBrokenAsync([FromBody] NlpQueryRequestDto requestDto)
        {
            try
            {
                if (string.IsNullOrEmpty(requestDto.Query))
                    return BadRequest(new { error = "Query is required" });

                if (requestDto.ChatId <= 0)
                    return BadRequest(new { error = "ChatId is required and must be positive" });

                var isValid = await _openAiApiService.IsChainBrokenAsync(requestDto.Query, requestDto.ChatId);

                return Ok(isValid);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("generate-clarifying")]
        public async Task<IActionResult> GenerateClarifying([FromBody] NlpQueryRequestDto requestDto)
        {
            try
            {
                if (string.IsNullOrEmpty(requestDto.Query))
                    return BadRequest(new { error = "Query is required" });

                var result = await _openAiApiService.GenerateClarifyingAsync(requestDto.Query, requestDto.ChatId);

                return Ok(_mapper.Map<GenerateClarifyingDto>(result));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("generate-sql")]
        public async Task<IActionResult> GenerateSqlFromNaturalLanguage([FromBody] NlpQueryRequestDto requestDto)
        {
            try
            {
                var modelAi = requestDto.Model;

                if (string.IsNullOrEmpty(requestDto.Query))
                    return BadRequest(new { error = "Query is required" });

                var listSql = await _sqlQueryService.GenerateSqlAsync(requestDto.Query, requestDto.ChatId, modelAi);

                if (listSql.IsNullOrEmpty())
                    return BadRequest(new { error = "Failed to generate SQL query" });

                var resultGeneration = await _sqlQueryService.ExecuteAISqlAsync(listSql);

                var result = _mapper.Map<GeneralNlpQueryResponseDto>(resultGeneration);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error executing SQL: {ex.Message}");
            }
        }
    }
}
