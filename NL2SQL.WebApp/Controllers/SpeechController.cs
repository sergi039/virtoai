using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.Speech.Response;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/speech-service")]
    [ApiController]
    [Authorize]
    public class SpeechController : ControllerBase
    {
        private readonly ISpeechService _speechService;
        private readonly IMapper  _mapper;
        
        public SpeechController(ISpeechService speechService, IMapper  mapper)
        {
            _speechService = speechService;
            _mapper = mapper;
        }

        [HttpGet("auth-token")]
        public async Task<IActionResult> GetSpeechAuthToken()
        {
            try
            {
                var result = await _speechService.GetSpeechTokenAsync();
                var tokenDto = _mapper.Map<SpeechTokenDto>(result);
                
                return Ok(tokenDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
