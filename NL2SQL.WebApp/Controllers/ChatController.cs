using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Dtos.Chat.Request;
using NL2SQL.WebApp.Dtos.Chat.Response;
using NL2SQL.WebApp.Dtos.ChatUser.Request;
using NL2SQL.WebApp.Dtos.ChatUser.Response;
using NL2SQL.WebApp.Models.Chat.Request;
using NL2SQL.WebApp.Models.ChatUser.Request;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/chats")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IMapper _mapper;

        public ChatController(IChatService chatService, IMapper mapper)
        {
            _chatService = chatService ?? throw new ArgumentNullException(nameof(chatService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpPost]
        public async Task<IActionResult> CreateChat([FromBody] AddChatDto requestDto)
        {
            try
            {
                var chatToCreateModel = _mapper.Map<AddChatModel>(requestDto);

                var chatCreatedModel = await _chatService.CreateChatAsync(chatToCreateModel);

                var resultDto = _mapper.Map<ChatDto>(chatCreatedModel);

                return Ok(resultDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateChatUser([FromBody] AddChatUserDto requestDto)
        {
            try
            {
                var chatUserCreated = await _chatService.CreateChatUserAsync(_mapper.Map<AddChatUserModel>(requestDto));
                var resultDto = _mapper.Map<ChatUserDto>(chatUserCreated);

                return Ok(resultDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetChat(int id)
        {
            try
            {
                var chatModel = await _chatService.GetChatByIdAsync(id);

                var resultDto = _mapper.Map<ChatDto>(chatModel);

                return Ok(resultDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllChats()
        {
            var chatsModels = await _chatService.GetAllChatsAsync();

            var chats = _mapper.Map<IList<ChatDto>>(chatsModels);

            return Ok(chats);
        }

        [HttpGet("messages/{userId}")]
        public async Task<IActionResult> GetAllWithFullIncludeByUserIdAsync(string userId)
        {
            var chatsModels = await _chatService.GetAllWithFullIncludeByUserIdAsync(userId);

            var chats = _mapper.Map<IList<ChatDto>>(chatsModels);

            return Ok(chats);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChat(int id, [FromBody] EditChatDto requestDto)
        {
            try
            {
                var chatToEditModel = _mapper.Map<EditChatModel>(requestDto);

                var chatModel = await _chatService.UpdateChatAsync(id, chatToEditModel);

                var resultDto = _mapper.Map<ChatDto>(chatModel);

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
        public async Task<IActionResult> DeleteChat(int id)
        {
            try
            {
                await _chatService.DeleteChatAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteChatUser(int id)
        {
            try
            {
                await _chatService.DeleteChatUserAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
