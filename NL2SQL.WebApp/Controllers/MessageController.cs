using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.Message.Request;
using NL2SQL.WebApp.Dtos.Message.Response;
using NL2SQL.WebApp.Models.Message.Request;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/messages")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IMapper _mapper;

        public MessageController(IMessageService messageService, IMapper mapper)
        {
            _messageService = messageService ?? throw new ArgumentNullException(nameof(messageService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] AddMessageDto requestDto)
        {
            try
            {
                var messageToAddModel = _mapper.Map<AddMessageModel>(requestDto);

                var messageCreatedModel = await _messageService.CreateMessageAsync(messageToAddModel);

                var resultDto = _mapper.Map<MessageDto>(messageCreatedModel);

                return Ok(resultDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("sql-content/{id}")]
        public async Task<IActionResult> UpdateSqlMessage(int id, [FromBody] EditSqlMessageDto requestDto)
        {
            try
            {
                if (id != requestDto.Id)
                    return BadRequest("Message ID mismatch.");

                var sqlMessageToEditModel = _mapper.Map<EditSqlMessageModel>(requestDto);

                var sqlMessageModel = await _messageService.UpdateSqlMessageAsync(id, sqlMessageToEditModel);

                var resultDto = _mapper.Map<SqlMessageDto>(sqlMessageModel);

                return Ok(resultDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMessage(int id, [FromBody] EditMessageDto requestDto)
        {
            try
            {
                if (id != requestDto.Id)
                    return BadRequest("Message ID mismatch.");

                var messageToEditModel = _mapper.Map<EditMessageModel>(requestDto);

                var messageModel = await _messageService.UpdateMessageAsync(id, messageToEditModel);
                
                var resultDto = _mapper.Map<MessageDto>(messageModel);

                return Ok(resultDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            try
            {
                await _messageService.DeleteMessageAsync(id);

                return Ok(true);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
