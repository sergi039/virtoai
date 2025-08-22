using NL2SQL.WebApp.Models.Chat.Request;
using NL2SQL.WebApp.Models.Chat.Response;
using NL2SQL.WebApp.Models.ChatUser.Request;
using NL2SQL.WebApp.Models.ChatUser.Response;

namespace NL2SQL.WebApp.Services.Interfaces
{
    public interface IChatService
    {
        Task<ChatModel> CreateChatAsync(AddChatModel addChatModel);
        Task<ChatUserModel> CreateChatUserAsync(AddChatUserModel addChatUserModel);
        Task<ChatModel> UpdateChatAsync(int id, EditChatModel editChatModel);
        Task<ChatModel> GetChatByIdAsync(int id);
        Task<ChatModel> GetChatWithAllIncludeByIdAsync(int id);
        Task<IList<ChatModel>> GetAllChatsAsync();
        Task<IList<ChatModel>> GetAllWithFullIncludeByUserIdAsync(string userId);
        Task DeleteChatAsync(int id);
        Task DeleteChatUserAsync(int id);
    }
}
