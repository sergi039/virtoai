using AutoMapper;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models;
using NL2SQL.WebApp.Models.Chat.Request;
using NL2SQL.WebApp.Models.Chat.Response;
using NL2SQL.WebApp.Models.ChatUser.Request;
using NL2SQL.WebApp.Models.ChatUser.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services
{
    public class ChatService : IChatService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ChatService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ChatModel> CreateChatAsync(AddChatModel addChatModel)
        {
            if (string.IsNullOrWhiteSpace(addChatModel.Title))
                throw new ArgumentException("Title cannot be empty", nameof(addChatModel.Title));

            var chatToAdd = new ChatEntity()
            {
                Title = addChatModel.Title,
                UserOwnerId = addChatModel.UserOwnerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _unitOfWork.Chats.AddAsync(chatToAdd);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ChatModel>(chatToAdd);
        }

        public async Task<ChatUserModel> CreateChatUserAsync(AddChatUserModel addChatUserModel)
        {
            if (string.IsNullOrWhiteSpace(addChatUserModel.UserId) || addChatUserModel.ChatId == 0)
                throw new ArgumentException("User id and chat id cannot be empty");

            var chatUserToAdd = new ChatUserEntity()
            {
                UserId = addChatUserModel.UserId,
                ChatId = addChatUserModel.ChatId,
                Email = addChatUserModel.Email,
                PhotoUrl = addChatUserModel.PhotoUrl,
                Username = addChatUserModel.Username,
                JoinedAt = DateTime.UtcNow
            };

            await _unitOfWork.ChatUsers.AddAsync(chatUserToAdd);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ChatUserModel>(chatUserToAdd);
        }

        public async Task DeleteChatAsync(int id)
        {
            var chatToDelete = await _unitOfWork.Chats.GetByIdAsync(id);

            if (chatToDelete == null)
                throw new KeyNotFoundException($"Chat with ID {id} not found");

            await _unitOfWork.Chats.DeleteAsync(chatToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteChatUserAsync(int id)
        {
            var chatUserToDelete = await _unitOfWork.ChatUsers.GetByIdAsync(id);

            if (chatUserToDelete == null)
                throw new KeyNotFoundException($"ChatUser with ID {id} not found");

            await _unitOfWork.ChatUsers.DeleteAsync(chatUserToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IList<ChatModel>> GetAllChatsAsync()
        {
            var chat = await _unitOfWork.Chats.GetAllAsync();

            return _mapper.Map<IList<ChatModel>> (chat);
        }

        public async Task<IList<ChatModel>> GetAllWithFullIncludeByUserIdAsync(string userId)
        {
            var chat = await _unitOfWork.Chats.GetAllWithFullIncludeByUserIdAsync(userId);

            return _mapper.Map<IList<ChatModel>>(chat);
        }

        public async Task<ChatModel> GetChatByIdAsync(int id)
        {
            var chat = await _unitOfWork.Chats.GetByIdAsync(id);

            if (chat == null)
                throw new KeyNotFoundException($"Chat with ID {id} not found");

            return _mapper.Map<ChatModel>(chat);
        }

        public async Task<ChatModel> GetChatWithAllIncludeByIdAsync(int id)
        {
            var chat = await _unitOfWork.Chats.GetWithAllIncludeByIdAsync(id);

            if (chat == null)
                throw new KeyNotFoundException($"Chat with ID {id} not found");

            return _mapper.Map<ChatModel>(chat);
        }

        public async Task<ChatModel> UpdateChatAsync(int id, EditChatModel editChatModel)
        {
            var chatToEdit = await _unitOfWork.Chats.GetByIdAsync(id);

            if (chatToEdit == null)
                throw new KeyNotFoundException($"Chat with ID {id} not found");

            chatToEdit.Title = editChatModel.Title;
            chatToEdit.UpdatedAt = editChatModel.UpdatedAt;

            await _unitOfWork.Chats.UpdateAsync(chatToEdit);
            await _unitOfWork.CompleteAsync();

            return await GetChatWithAllIncludeByIdAsync(id);
        }
    }
}
