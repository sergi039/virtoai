using NL2SQL.WebApp.Models.Message.Request;
using NL2SQL.WebApp.Models.Message.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IMessageService
    {
        Task<IList<MessageModel>> GetMessagesByChatIdAsync(int chatId);
        Task<MessageModel> CreateMessageAsync(AddMessageModel addMessageModel);
        Task<MessageModel> UpdateMessageAsync(int id, EditMessageModel editMessageModel);
        Task<SqlMessageModel> UpdateSqlMessageAsync(int id, EditSqlMessageModel editSqlMessageModel);
        Task DeleteMessageAsync(int id);
    }
}
