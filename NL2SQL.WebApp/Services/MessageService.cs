using AutoMapper;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models;
using NL2SQL.WebApp.Models.Message.Request;
using NL2SQL.WebApp.Models.Message.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services
{
    public class MessageService : IMessageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MessageService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<MessageModel> CreateMessageAsync(AddMessageModel addMessageModel)
        {
            if (string.IsNullOrWhiteSpace(addMessageModel.Text))
                throw new ArgumentException("Text cannot be empty", nameof(addMessageModel.Text));

            var existChat = await _unitOfWork.Chats.GetByIdAsync(addMessageModel.ChatId);

            if (existChat == null)
                throw new KeyNotFoundException($"Chat with ID {addMessageModel.ChatId} not found");

            var chatAdd = new MessageEntity()
            {
                Text = addMessageModel.Text,
                CreatedAt = DateTime.UtcNow,
                Type = addMessageModel.Type,
                PreviousMessageId = addMessageModel.PreviousMessageId,
                CombinedQuery = addMessageModel.CombinedQuery,
                FollowUpQuestions = addMessageModel.FollowUpQuestions,
                Suggestions = addMessageModel.Suggestions,
                ChatId = addMessageModel.ChatId,
                IsUser = addMessageModel.IsUser,
                SqlMessages = addMessageModel.SqlMessages.Select(sql => new SqlMessageEntity
                {
                    Sql = sql.Sql,
                    Model = sql.Model,
                    ErrorMessage = sql.ErrorMessage,
                    IsSyntaxError = sql.IsSyntaxError,
                    Text = sql.Text,
                    CreatedAt = DateTime.UtcNow
                }).ToList()
            };

            existChat.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Chats.UpdateAsync(existChat);
            await _unitOfWork.Messages.AddAsync(chatAdd);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<MessageModel>(chatAdd);
        }

        public async Task<SqlMessageModel> UpdateSqlMessageAsync(int id, EditSqlMessageModel editSqlMessageModel)
        {
            var sqlMessageToEdit = await _unitOfWork.SqlMessages.GetByIdAsync(id);

            if (sqlMessageToEdit == null)
                throw new KeyNotFoundException($"Sql message with ID {id} not found");

            sqlMessageToEdit.Text = editSqlMessageModel.Text;
            sqlMessageToEdit.Sql = editSqlMessageModel.Sql;
            sqlMessageToEdit.Model = editSqlMessageModel.Model;
            sqlMessageToEdit.IsSyntaxError = editSqlMessageModel.IsSyntaxError;
            sqlMessageToEdit.ErrorMessage = editSqlMessageModel.ErrorMessage;
            sqlMessageToEdit.Reaction = editSqlMessageModel.Reaction;

            await _unitOfWork.SqlMessages.UpdateAsync(sqlMessageToEdit);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<SqlMessageModel>(sqlMessageToEdit);
        }

        public async Task DeleteMessageAsync(int id)
        {
            var messageToDelete = await _unitOfWork.Messages.GetByIdAsync(id);

            if (messageToDelete == null)
                throw new KeyNotFoundException($"Message with ID {id} not found");

            await _unitOfWork.Messages.DeleteAsync(messageToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<MessageModel> UpdateMessageAsync(int id, EditMessageModel editMessageModel)
        {
            var messageToEdit = await _unitOfWork.Messages.GetByIdAsync(id);

            if (messageToEdit == null)
                throw new KeyNotFoundException($"Message with ID {id} not found");

            messageToEdit.Text = editMessageModel.Text;
            messageToEdit.PreviousMessageId = editMessageModel.PreviousMessageId;
            messageToEdit.CombinedQuery = editMessageModel.CombinedQuery;
            messageToEdit.IsUser = editMessageModel.IsUser;
            messageToEdit.ChatId = editMessageModel.ChatId;

            await _unitOfWork.Messages.UpdateAsync(messageToEdit);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<MessageModel>(messageToEdit);
        }

        public async Task<IList<MessageModel>> GetMessagesByChatIdAsync(int chatId)
        {
            var result = await _unitOfWork.Messages.GetAllByChatIdAsync(chatId);
            return _mapper.Map<IList<MessageModel>>(result);
        }
    }
}
