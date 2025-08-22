using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.Database.Response;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/databases")]
    [ApiController]
    [Authorize]
    public class DatabaseInfoController : ControllerBase
    {
        private readonly IDatabaseInfoService _databaseInfoService;
        private readonly IMapper _mapper;

        public DatabaseInfoController(IDatabaseInfoService databaseInfoService, IMapper mapper)
        {
            _databaseInfoService = databaseInfoService;
            _mapper = mapper;
        }

        [HttpGet("schema")]
        public async Task<ActionResult<DatabaseSchemaDto>> GetDatabaseSchema()
        {
            try
            {
                var schemaModel = await _databaseInfoService.GetDatabaseSchemaAsync();

                return Ok(_mapper.Map<DatabaseSchemaDto>(schemaModel));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to retrieve database schema",
                    details = ex.Message
                });
            }
        }

        [HttpGet("tables")]
        public IActionResult GetAllTables()
        {
            var tables = _databaseInfoService.GetDatabaseTablesService();
            return Ok(tables);
        }

        [HttpGet("tables/available")]
        public async Task<IActionResult> GetAvailableTables()
        {
            var result = await _databaseInfoService.GetAvailableTablesServiceAsync();
            return Ok(result);
        }

        [HttpPost("sql/execute")]
        public async Task<IActionResult> ExecuteSqlQuery([FromBody] string sql)
        {
            if (string.IsNullOrWhiteSpace(sql))
                return BadRequest(new { message = "SQL query cannot be empty." });

            try
            {
                var result = await _databaseInfoService.ExecuteSqlAsync(sql);

                return Ok(_mapper.Map<SqlOperationResultDto>(result));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new SqlOperationResultDto() {IsSuccess = false, ErrorMessage = ex.Message });
            }
        }
    }
}
