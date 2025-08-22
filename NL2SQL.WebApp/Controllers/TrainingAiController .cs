using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.SqlTrainingData.Request;
using NL2SQL.WebApp.Models.SqlTrainingData.Request;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/training-data")]
    [ApiController]
    [Authorize]
    public class TrainingAiController : ControllerBase
    {
        private readonly ISqlTrainingDataService _sqlTrainingDataService;
        private readonly IMapper _mapper;

        public TrainingAiController(ISqlTrainingDataService sqlTrainingDataService, IMapper mapper)
        {
            _sqlTrainingDataService = sqlTrainingDataService ?? 
                      throw new ArgumentNullException(nameof(sqlTrainingDataService));

            _mapper = mapper ?? 
                      throw new ArgumentNullException(nameof(mapper));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTrainingData([FromBody] AddSqlTrainingDataDto requestDto)
        {
            var result = await _sqlTrainingDataService.AddTrainingDataAsync(_mapper.Map<AddSqlTrainingDataModel>(requestDto));

            return Ok(result);
        }
    }
}
