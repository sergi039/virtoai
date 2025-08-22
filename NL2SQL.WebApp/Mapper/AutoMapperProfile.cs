using AutoMapper;
using NL2SQL.WebApp.Dtos.AiGenerate.Request;
using NL2SQL.WebApp.Dtos.AiGenerate.Response;
using NL2SQL.WebApp.Dtos.Chat.Request;
using NL2SQL.WebApp.Dtos.Chat.Response;
using NL2SQL.WebApp.Dtos.ChatUser.Request;
using NL2SQL.WebApp.Dtos.ChatUser.Response;
using NL2SQL.WebApp.Dtos.Database.Response;
using NL2SQL.WebApp.Dtos.FieldContext.Request;
using NL2SQL.WebApp.Dtos.Message.Request;
using NL2SQL.WebApp.Dtos.Message.Response;
using NL2SQL.WebApp.Dtos.Service.Request;
using NL2SQL.WebApp.Dtos.Service.Response;
using NL2SQL.WebApp.Dtos.ServiceConstructor.Request;
using NL2SQL.WebApp.Dtos.ServiceConstructor.Response;
using NL2SQL.WebApp.Dtos.Setting.Request;
using NL2SQL.WebApp.Dtos.Setting.Response;
using NL2SQL.WebApp.Dtos.Speech.Response;
using NL2SQL.WebApp.Dtos.SqlTrainingData.Request;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Entities.Enums;
using NL2SQL.WebApp.Models;
using NL2SQL.WebApp.Models.AiGenerate.Request;
using NL2SQL.WebApp.Models.AiGenerate.Response;
using NL2SQL.WebApp.Models.Apollo.Request;
using NL2SQL.WebApp.Models.Chat.Request;
using NL2SQL.WebApp.Models.Chat.Response;
using NL2SQL.WebApp.Models.ChatUser.Request;
using NL2SQL.WebApp.Models.ChatUser.Response;
using NL2SQL.WebApp.Models.Database.Response;
using NL2SQL.WebApp.Models.Freshdesk.Request;
using NL2SQL.WebApp.Models.Message.Request;
using NL2SQL.WebApp.Models.Message.Response;
using NL2SQL.WebApp.Models.Ortto.Request;
using NL2SQL.WebApp.Models.Pipedrive.Request;
using NL2SQL.WebApp.Models.Service.Request;
using NL2SQL.WebApp.Models.Service.Response;
using NL2SQL.WebApp.Models.ServiceConstructor.Request;
using NL2SQL.WebApp.Models.ServiceConstructor.Response;
using NL2SQL.WebApp.Models.Setting.Request;
using NL2SQL.WebApp.Models.Setting.Response;
using NL2SQL.WebApp.Models.Speech.Response;
using NL2SQL.WebApp.Models.SqlGenerationRule.Response;
using NL2SQL.WebApp.Models.SqlTrainingData.Request;

namespace NL2SQL.WebApp.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ChatEntity, ChatModel>();
            CreateMap<MessageEntity, MessageModel>();

            CreateMap<AddSqlTrainingDataDto, AddSqlTrainingDataModel>();
            CreateMap<SqlMessageEntity, SqlMessageModel>();

            CreateMap<SqlMessageModel, SqlMessageDto>()
                .ForMember(dest => dest.Reaction, opt => opt.MapFrom(src => src.Reaction.ToString()));

            CreateMap<MessageModel, MessageDto>();

            CreateMap<AddMessageDto, AddMessageModel>();
            CreateMap<AddSqlMessageDto, AddSqlMessageModel>();
            CreateMap<SpeechTokenModel, SpeechTokenDto>();

            CreateMap<ServiceRegistryModel, ServiceRegistryDto>();
            CreateMap<ServiceRegistryEntity, ServiceRegistryModel>();

            CreateMap<ForeignKeyModel, ForeignKeyDto>();

            CreateMap<EditServiceTableDto, EditServiceTableModel>();
            CreateMap<AddServiceTableDto, AddServiceTableModel>();
            CreateMap<ServiceTableModel, ServiceTableDto>();
            CreateMap<ServiceTableEntity, ServiceTableModel>();

            CreateMap<ChatUserEntity, ChatUserModel>();
            CreateMap<ChatUserModel, ChatUserDto>();
            CreateMap<AddChatUserDto, AddChatUserModel>();

            CreateMap<GenerateClarifyingModel, GenerateClarifyingDto>();

            CreateMap<SqlOperationResultModel, SqlOperationResultDto>();

            CreateMap<RowDataDto, RowDataModel>();

            CreateMap<RequestGenerateFieldContextDto, RequestGenerateFieldContextModel>();

            CreateMap<SqlGenerationRuleModel, SqlGenerationRuleDto>();
            CreateMap<SqlGenerationRuleEntity, SqlGenerationRuleModel>();
            CreateMap<AddSqlGenerationRuleDto, AddSqlGenerationRuleModel>();
            CreateMap<EditSqlGenerationRuleDto, EditSqlGenerationRuleModel>();

            CreateMap<ServiceTableFieldModel, ServiceTableFieldDto>();
            CreateMap<ServiceTableFieldEntity, ServiceTableFieldModel>();
            CreateMap<AddServiceTableFieldDto, AddServiceTableFieldModel>();
            CreateMap<EditServiceTableFieldDto, EditServiceTableFieldModel>();

            CreateMap<ServiceTableImplicitRelationModel, ServiceTableImplicitRelationDto>();
            CreateMap<ServiceTableImplicitRelationEntity, ServiceTableImplicitRelationModel>();
            CreateMap<AddServiceTableImplicitRelationDto, AddServiceTableImplicitRelationModel>();

            CreateMap<FieldContextMenuItemModel, FieldContextMenuItemDto>();
            CreateMap<ServiceTableFieldContextMenuItemEntity, FieldContextMenuItemModel>();
            CreateMap<AddFieldContextMenuItemDto, AddFieldContextMenuItemModel>();
            CreateMap<EditFieldContextMenuItemDto, EditFieldContextMenuItemModel>();

            CreateMap<DatabaseSchemaModel, DatabaseSchemaDto>();
            CreateMap<TableFieldModel, TableFieldDto>();
            CreateMap<TableSchemaModel, TableSchemaDto>();

            CreateMap<NlpQueryResponseModel, NlpQueryResponseDto>();
            CreateMap<GeneralNlpQueryResponseModel, GeneralNlpQueryResponseDto>();

            CreateMap<EditSqlMessageDto, EditSqlMessageModel>()
                .ForMember(dest => dest.Reaction, opt => opt.MapFrom(src =>
                    src.Reaction.ToLower() == "like" ? ReactionType.Like :
                    src.Reaction.ToLower() == "dislike" ? ReactionType.Dislike :
                    ReactionType.None));

            CreateMap<AddChatDto, AddChatModel>();
            CreateMap<EditChatDto, EditChatModel>();
            CreateMap<ChatModel, ChatDto>();

            CreateMap<PipedriveSettingEntity, PipedriveSettingModel>()
                .ForMember(dest => dest.Tables,
                    opt => opt.MapFrom(src => src.Tables.Split(',', StringSplitOptions.RemoveEmptyEntries)));

            CreateMap<OrttoSettingEntity, OrttoSettingModel>()
                .ForMember(dest => dest.Tables,
                    opt => opt.MapFrom(src => src.Tables.Split(',', StringSplitOptions.RemoveEmptyEntries)));

            CreateMap<FreshdeskSettingEntity, FreshdeskSettingModel>()
                .ForMember(dest => dest.Tables,
                    opt => opt.MapFrom(src => src.Tables.Split(',', StringSplitOptions.RemoveEmptyEntries)));

            CreateMap<ApolloSettingEntity, ApolloSettingModel>()
                .ForMember(dest => dest.Tables,
                    opt => opt.MapFrom(src => src.Tables.Split(',', StringSplitOptions.RemoveEmptyEntries)));

            CreateMap<OrttoSettingModel, OrttoSettingDto>();
            CreateMap<PipedriveSettingModel, PipedriveSettingDto>();
            CreateMap<FreshdeskSettingModel, FreshdeskSettingDto>();
            CreateMap<ApolloSettingModel, ApolloSettingDto>();

            CreateMap<EditOrttoSettingDto, EditOrttoSettingModel>();
            CreateMap<EditPipedriveSettingDto, EditPipedriveSettingModel>();
            CreateMap<EditFreshdeskSettingDto, EditFreshdeskSettingModel>();
            CreateMap<EditApolloSettingDto, EditApolloSettingModel>();

            CreateMap<EditOrttoSettingModel, OrttoSettingEntity>()
                .ForMember(dest => dest.Tables, opt => opt.MapFrom(src => string.Join(',', src.Tables)));

            CreateMap<EditPipedriveSettingModel, PipedriveSettingEntity>()
                .ForMember(dest => dest.Tables, opt => opt.MapFrom(src => string.Join(',', src.Tables)));

            CreateMap<EditFreshdeskSettingModel, FreshdeskSettingEntity>()
                .ForMember(dest => dest.Tables, opt => opt.MapFrom(src => string.Join(',', src.Tables)));

            CreateMap<EditApolloSettingModel, ApolloSettingEntity>()
                .ForMember(dest => dest.Tables, opt => opt.MapFrom(src => string.Join(',', src.Tables)));

            CreateMap<PipedriveSettingDto, PipedriveImportOptionsModel>()
                .ForMember(dest => dest.Entities, opt => opt.MapFrom(src =>
                    string.IsNullOrWhiteSpace(src.Entities)
                        ? new List<string> { "all" }
                        : src.Entities.Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => s.Trim())
                            .ToList()));

            CreateMap<OrttoSettingDto, OrttoImportOptionsModel>();
            CreateMap<FreshdeskSettingDto, FreshdeskImportOptionsModel>();
            CreateMap<ApolloSettingDto, ApolloImportOptionsModel>();

            CreateMap<ApolloSettingEntity, ApolloImportOptionsModel>();
            CreateMap<OrttoSettingEntity, OrttoImportOptionsModel>();
            CreateMap<FreshdeskSettingEntity, FreshdeskImportOptionsModel>();
            CreateMap<PipedriveSettingEntity, PipedriveImportOptionsModel>()
                .ForMember(dest => dest.Entities, opt => opt.MapFrom(src =>
                    string.IsNullOrWhiteSpace(src.Entities)
                        ? new List<string> { "all" }
                        : src.Entities.Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => s.Trim())
                            .ToList()));
        }
    }
}
