import { type ITheme } from '@fluentui/react';
import { create } from 'zustand';
import { IAIModel, IApolloSetting, IChat, IChatUser, IFreshdeskSetting, IGeneralServiceSetting, IMessage, IOrttoSetting, IPipedriveSetting, ISpeech, ISqlMessage, IUser, INlpQueryRequest, IUserProfile, IRequestGenerateFieldContext, GenerateClarifying } from '../api/model';
import { chatService, databaseInfoService, messageService, settingDataService, speechService, trainingAiService, azureGraphService, constructorService, aiGenerateService } from '../api/services';
import { darkTheme, lightTheme } from '../api/constants/teamsThemes';
import { aiModelsDefault, defaultUser } from '../api/constants';
import { ITrainingAiData } from '../api/model/ITrainingAiData';
import { IGeneralNlpQueryResponse } from '../api/model/IGeneralNlpQueryResponse';
import { ISqlGenerationRule } from '../api/model/ISqlGenerationRule';
import { DatabaseSchemaResponse } from '../api/model/ITableSchema';
import { IServiceRegistry, IServiceTable, IServiceTableField, IServiceTableImplicitRelation, FieldContextMenuItem } from '../api/model/IServiceRegistry';
import { ISqlOperationResult } from '../api/model/ISqlOperationResult';

export type NL2SQLState = {
  chats: IChat[];
  currentChat: IChat | null;
  currentUser: IUser;
  currentMessages: IMessage[];
  currentTheme: ITheme;
  isLoading: boolean;
  tokenApi: string;
  tokenApiExpiresAt: number;
  settings: IGeneralServiceSetting | null;
  isInitializeStore: boolean;
  currentAIModel: IAIModel | null;
  selectedAIModels: IAIModel[];
  aiModels: IAIModel[];
  sqlgenerationRules: ISqlGenerationRule[];
  serviceRegistrations: IServiceRegistry[];
  serviceTables: IServiceTable[];
  serviceTableFields: IServiceTableField[];

  chatLoadingStates: Record<number, boolean>;

  textToInsert: string;

  azureUser: any | null;
  msalInstance?: any;
  userPhoto: string | null;
  userProfile: any | null;
  isUserDataLoading: boolean;

  azureUsers: IUserProfile[];

  databaseSchema: DatabaseSchemaResponse | null;

  getAllAIModels: () => IAIModel[];
  setTokenApi: (instance?: any) => Promise<void>;
  getValidTokenApi: (instance?: any) => Promise<string>;
  setCurrentAIModel: (model: IAIModel) => void;
  setSelectedAIModels: (models: IAIModel[]) => void;
  toggleTheme: () => void;
  initializeStore: (accounts?: any[], instance?: any) => Promise<void>;

  getCurrentUser: (instance: any, account: any) => Promise<void>;
  getAllTenantUsers: (instance: any, account: any) => Promise<void>;
  clearUserData: () => void;
  getCurrentUserId: () => string;
  getUserPhotoById: (userId: string, abortSignal?: AbortSignal) => Promise<string | null>;

  getSpeechToken: (abortSignal?: AbortSignal) => Promise<ISpeech>;

  getAllNameDatabaseTables: () => Promise<string[]>;

  saveTrainingData: (addData: ITrainingAiData, abortSignal?: AbortSignal) => Promise<boolean>;
  deleteTrainingData: (deleteData: ITrainingAiData, abortSignal?: AbortSignal) => Promise<boolean>;

  getAllRules: () => Promise<ISqlGenerationRule[]>;
  addRule: (rule: ISqlGenerationRule) => Promise<ISqlGenerationRule>;
  editRule: (ruleId: number, updatedData: ISqlGenerationRule) => Promise<ISqlGenerationRule>;
  deleteRule: (ruleId: number) => Promise<void>;

  getAllSettings: () => Promise<IGeneralServiceSetting>;
  editGeneralServiceSetting: (setting: IGeneralServiceSetting) => Promise<boolean>;
  refreshSettings: () => Promise<void>;

  setCurrentUser: (user: IUser) => void;

  syncApolloSettings: (setting: IApolloSetting) => Promise<boolean>;
  syncOrttoSettings: (setting: IOrttoSetting) => Promise<boolean>;
  syncPipedriveSettings: (setting: IPipedriveSetting) => Promise<boolean>;
  syncFreshdeskSettings: (setting: IFreshdeskSetting) => Promise<boolean>;

  setCurrentChat: (chat: IChat | null) => void;
  getAllChats: () => Promise<IChat[]>;
  getChatById: (chatId: number) => Promise<IChat | undefined>;
  addChat: (chat: IChat) => Promise<IChat | null>;
  deleteChat: (chatId: number) => Promise<void>;
  editChat: (chatId: number, updatedChat: IChat) => Promise<void>;
  addChatUser: (chatUser: IChatUser) => Promise<IChatUser>;
  removeChatUser: (chatUserId: number) => Promise<boolean>;

  addMessage: (message: IMessage) => Promise<IMessage | null>;
  deleteMessage: (messageId: number) => Promise<void>;
  editMessage: (messageId: number, updatedMessage: IMessage) => Promise<IMessage>;
  editSqlMessage: (id: number, updatedSql: ISqlMessage) => Promise<ISqlMessage>;

  generateAIMessage: (requestToAi: INlpQueryRequest) => Promise<IGeneralNlpQueryResponse | null>;
  generateFieldContext: (requestToAi: IRequestGenerateFieldContext) => Promise<string[]>;
  isCheckBrokeChain: (requestToAi: INlpQueryRequest) => Promise<boolean>;
  generateClarifying: (requestToAi: INlpQueryRequest) => Promise<GenerateClarifying | null>;

  getAvailableTables: () => Promise<string[]>;
  executeSql: (sql: string, abortSignal?: AbortSignal) => Promise<ISqlOperationResult>;

  getDatabaseSchemaForEditor: () => Promise<DatabaseSchemaResponse>;
  setDatabaseSchema: (schema: DatabaseSchemaResponse) => void;

  getServiceRegistrations: () => Promise<IServiceRegistry[]>;
  setServiceRegistrations: (registrations: IServiceRegistry[]) => void;
  getTablesByServiceId: (serviceId: number, abortSignal?: AbortSignal) => Promise<IServiceTable[]>;

  createServiceTable: (serviceTable: IServiceTable, abortSignal?: AbortSignal) => Promise<IServiceTable>;
  updateServiceTable: (serviceTableId: number, serviceTable: IServiceTable, abortSignal?: AbortSignal) => Promise<IServiceTable>;
  deleteServiceTable: (serviceTableId: number, abortSignal?: AbortSignal) => Promise<boolean>;
  getAllServiceTables: (abortSignal?: AbortSignal) => Promise<IServiceTable[]>;

  createImplicitRelation: (relation: IServiceTableImplicitRelation, abortSignal?: AbortSignal) => Promise<IServiceTableImplicitRelation>;
  deleteImplicitRelation: (relationId: number, abortSignal?: AbortSignal) => Promise<boolean>;
  getAllImplicitRelations: (abortSignal?: AbortSignal) => Promise<IServiceTableImplicitRelation[]>;

  getAllServiceTablesWithFields: (abortSignal?: AbortSignal) => Promise<IServiceTable[]>;
  getAllServiceTableFields: (abortSignal?: AbortSignal) => Promise<IServiceTableField[]>;
  getServiceTableFields: (serviceTableId: number, abortSignal?: AbortSignal) => Promise<IServiceTableField[]>;
  createServiceTableField: (serviceTableField: IServiceTableField, abortSignal?: AbortSignal) => Promise<IServiceTableField>;
  updateServiceTableField: (id: number, serviceTableField: IServiceTableField, abortSignal?: AbortSignal) => Promise<IServiceTableField>;
  deleteServiceTableField: (id: number, abortSignal?: AbortSignal) => Promise<boolean>;
  getServiceTableFieldByName: (serviceTableId: number, fieldName: string) => IServiceTableField | null;

  getServiceTableFieldByTableAndFieldName: (tableName: string, fieldName: string) => IServiceTableField | null;
  updateOrCreateServiceTableField: (tableName: string, fieldName: string, updates: Partial<IServiceTableField>, abortSignal?: AbortSignal) => Promise<IServiceTableField>;

  createFieldContextMenuItem: (contextMenuItem: FieldContextMenuItem, abortSignal?: AbortSignal) => Promise<FieldContextMenuItem>;
  updateFieldContextMenuItem: (id: number, contextMenuItem: FieldContextMenuItem, abortSignal?: AbortSignal) => Promise<FieldContextMenuItem>;
  deleteFieldContextMenuItem: (id: number, abortSignal?: AbortSignal) => Promise<boolean>;

  insertTextToInput: (text: string) => void;
  getTextToInsert: () => string;
  clearTextToInsert: () => void;

  setChatLoading: (chatId: number, isLoading: boolean) => void;
  isChatLoading: (chatId: number) => boolean;
  clearChatLoading: (chatId: number) => void;
};

export const useNL2SQLStore = create<NL2SQLState>()((set, get) => ({
  chats: [],
  currentUser: defaultUser,
  currentChat: null,
  currentMessages: [],
  currentAIModel: null,
  selectedAIModels: [],
  settings: null,
  aiModels: [],
  sqlgenerationRules: [],
  isInitializeStore: false,
  currentTheme: lightTheme,
  isLoading: false,
  tokenApi: '',
  tokenApiExpiresAt: 0,
  azureUser: null,
  userPhoto: null,
  userProfile: null,
  azureUsers: [],
  isUserDataLoading: false,
  databaseSchema: null,
  serviceRegistrations: [],
  serviceTableFields: [],
  serviceTables: [],
  chatLoadingStates: {},
  textToInsert: '',

  initializeStore: async (accounts?: any[], instance?: any) => {
    set({
      aiModels: aiModelsDefault,
      currentAIModel: aiModelsDefault[0],
      selectedAIModels: [aiModelsDefault[1]],
      isInitializeStore: false,
    });

    if (accounts && instance && accounts.length > 0) {
      const azureUser = accounts[0];
      set({ azureUser, msalInstance: instance });

      try {
        await get().setTokenApi();
      } catch (error) {
        console.error('Failed to acquire API token during initialization:', error);
      }

      const displayName = azureUser.name || azureUser.username || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || defaultUser.firstName;
      const lastName = nameParts.slice(1).join(' ') || defaultUser.lastName;

      const updatedUser: IUser = {
        ...defaultUser,
        id: azureUser.localAccountId || defaultUser.id,
        firstName,
        lastName,
        email: azureUser.username || defaultUser.email,
      };

      set({ currentUser: updatedUser });

      await get().getCurrentUser(instance, azureUser);
      await get().getAllTenantUsers(instance, azureUser);
    }

    try {
      const currentUser = get().currentUser;
      const tokenApi = get().tokenApi;

      if (tokenApi) {
        const chats = await chatService.getAllWithMessagesByUserId(currentUser.id, tokenApi);

        try {
          await get().getAllServiceTablesWithFields();
          await get().getAllServiceTableFields();
          await get().getAllSettings();
          await get().getServiceRegistrations();
        } catch (error) {
          console.error('Failed to load data', error);
        }

        const initialChat = chats.length > 0
          ? chats.reduce((latest, chat) =>
            !latest || new Date(chat.updatedAt) > new Date(latest.updatedAt) ? chat : latest
          )
          : null;

        set({
          chats,
          currentChat: initialChat,
          currentMessages: initialChat?.messages || [],
          isInitializeStore: true,
        });
      } else {
        set({ chats: [], currentChat: null, currentMessages: [], isInitializeStore: true });
      }
    } catch (error) {
      set({ chats: [], currentChat: null, currentMessages: [], isInitializeStore: true });
    }
  },

  setTokenApi: async () => {
    const msal = get().msalInstance;
    if (!msal) throw new Error('No MSAL instance available');
    try {
      const accounts = msal.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      const account = accounts[0];
      const tokenRequest = {
        scopes: [import.meta.env.VITE_AZURE_API_SCOPE],
        account: account
      };
      const token = await msal.acquireTokenSilent(tokenRequest);
      set({ tokenApi: token.accessToken, tokenApiExpiresAt: token.expiresOn.getTime() });
    } catch (error) {
      try {
        const tokenRequest = {
          scopes: [import.meta.env.VITE_AZURE_API_SCOPE],
        };
        await msal.acquireTokenRedirect(tokenRequest);
      } catch (redirectError) {
        throw redirectError;
      }
    }
  },

  getValidTokenApi: async () => {
    const state = get();
    const now = Date.now();
    if (!state.tokenApi || state.tokenApiExpiresAt - now < 60000) {
      await get().setTokenApi();
      return get().tokenApi;
    }
    return state.tokenApi;
  },

  getAllAIModels: () => get().aiModels,

  getAllSettings: async () => {
    set({ isLoading: true });
    try {
      const generalSettings = await settingDataService.getGeneralServiceSetting(await get().getValidTokenApi());
      set({ isLoading: false, settings: generalSettings });
      return generalSettings;
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to fetch settings");
    }
  },

  getSpeechToken: async (abortSignal) => {
    set({ isLoading: true });
    try {
      const result = await speechService.getToken(await get().getValidTokenApi(), abortSignal);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to fetch speech token");
    }
  },

  setCurrentAIModel: (model) => set({ currentAIModel: model }),

  setSelectedAIModels: (models) => set({ selectedAIModels: models }),

  setCurrentUser: (user) => set({ currentUser: user }),

  getAllRules: async () => {
    set({ isLoading: true });
    try {
      const rules = await settingDataService.getAllRules(await get().getValidTokenApi());
      set({ isLoading: false, sqlgenerationRules: rules });
      return rules;
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to fetch SQL generation rules");
    }
  },

  addRule: async (rule) => {
    set({ isLoading: true });
    try {
      const newRule = await settingDataService.saveRule(rule, await get().getValidTokenApi());
      set((state) => ({
        isLoading: false,
        sqlgenerationRules: [...state.sqlgenerationRules, newRule],
      }));
      return newRule;
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to add SQL generation rule");
    }
  },

  editRule: async (ruleId, updatedData) => {
    set({ isLoading: true });
    try {
      const updatedRule = await settingDataService.updateRule(ruleId, updatedData, await get().getValidTokenApi());
      set((state) => ({
        isLoading: false,
        sqlgenerationRules: state.sqlgenerationRules.map((rule) =>
          rule.id === ruleId ? updatedRule : rule
        ),
      }));
      return updatedRule;
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to edit SQL generation rule");
    }
  },

  deleteRule: async (ruleId) => {
    set({ isLoading: true });
    try {
      await settingDataService.delete(ruleId, await get().getValidTokenApi());
      set((state) => ({
        isLoading: false,
        sqlgenerationRules: state.sqlgenerationRules.filter((rule) => rule.id !== ruleId),
      }));
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to delete SQL generation rule");
    }
  },

  refreshSettings: async () => {
    try {
      const generalSettings = await settingDataService.getGeneralServiceSetting(await get().getValidTokenApi());
      set({ settings: generalSettings });
    } catch (error) {
      throw new Error("Failed to refresh settings");
    }
  },

  syncApolloSettings: async (setting) => {
    set({ isLoading: true });
    try {
      const response = await settingDataService.syncApolloSettings(setting, await get().getValidTokenApi());
      set({ isLoading: false });

      if (response) {
        await get().refreshSettings();
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  syncOrttoSettings: async (setting) => {
    set({ isLoading: true });
    try {
      const response = await settingDataService.syncOrttoSettings(setting, await get().getValidTokenApi());
      set({ isLoading: false });

      if (response) {
        await get().refreshSettings();
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  syncPipedriveSettings: async (setting) => {
    set({ isLoading: true });
    try {
      const response = await settingDataService.syncPipedriveSettings(setting, await get().getValidTokenApi());
      set({ isLoading: false });

      if (response) {
        await get().refreshSettings();
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  syncFreshdeskSettings: async (setting) => {
    set({ isLoading: true });
    try {
      const response = await settingDataService.syncFreshdeskSettings(setting, await get().getValidTokenApi());
      set({ isLoading: false });

      if (response) {
        await get().refreshSettings();
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  setCurrentChat: (chat) =>
    set({
      currentChat: chat,
      currentMessages: chat?.messages || [],
    }),

  getAllChats: async () => {
    set({ isLoading: true });
    try {
      const currentUser = get().currentUser;
  const chats = await chatService.getAllWithMessagesByUserId(currentUser.id, await get().getValidTokenApi());
      set({ chats, isLoading: false });
      return chats;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  getChatById: async (chatId) => {
    set({ isLoading: true });
    try {
  const chat = await chatService.get(chatId, await get().getValidTokenApi());
      set({ isLoading: false });
      return chat;
    } catch (error) {
      set({ isLoading: false });
      return undefined;
    }
  },

  addChat: async (chat) => {
    set({ isLoading: true });
    try {
  const newChat = await chatService.save(chat, await get().getValidTokenApi());

      set((state) => ({
        chats: [...state.chats, newChat],
        currentChat: newChat,
        currentMessages: newChat.messages || [],
        isLoading: false,
      }));

      return newChat;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  },

  generateAIMessage: async (requestToAi: INlpQueryRequest) => {
    set({ isLoading: true });
    if (requestToAi.chatId) {
      get().setChatLoading(requestToAi.chatId, true);
    }
    try {
      const response = await aiGenerateService.generateSql(requestToAi, await get().getValidTokenApi());
      set({ isLoading: false });
      if (requestToAi.chatId) {
        get().setChatLoading(requestToAi.chatId, false);
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
      if (requestToAi.chatId) {
        get().setChatLoading(requestToAi.chatId, false);
      }
      return null;
    }
  },

  generateFieldContext: async (requestToAi: IRequestGenerateFieldContext) => {
    set({ isLoading: true });
    try {
      const response = await aiGenerateService.generateFieldContext(requestToAi, await get().getValidTokenApi());
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  isCheckBrokeChain: async (requestToAi: INlpQueryRequest) => {
    set({ isLoading: true });
    if (requestToAi.chatId) {
      get().setChatLoading(requestToAi.chatId, true);
    }
    try {
      const response = await aiGenerateService.isCheckBrokeChain(requestToAi, await get().getValidTokenApi());
      set({ isLoading: false });
      if (requestToAi.chatId) {
        get().setChatLoading(requestToAi.chatId, false);
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
      if (requestToAi.chatId) {
        get().setChatLoading(requestToAi.chatId, false);
      }
      return false;
    }
  },

  generateClarifying: async (requestToAi: INlpQueryRequest) => {
    set({ isLoading: true });
    if (requestToAi.chatId) {
      get().setChatLoading(requestToAi.chatId, true);
    }
    try {
      const response = await aiGenerateService.generateClarifying(requestToAi, await get().getValidTokenApi());
      set({ isLoading: false });
      if (requestToAi.chatId) {
        get().setChatLoading(requestToAi.chatId, false);
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
      if (requestToAi.chatId) {
        get().setChatLoading(requestToAi.chatId, false);
      }
      return null;
    }
  },

  deleteChat: async (chatId) => {
    set({ isLoading: true });
    try {
      await chatService.delete(chatId, await get().getValidTokenApi());
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
        currentMessages: state.currentChat?.id === chatId ? [] : state.currentMessages,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
    }
  },

  editChat: async (chatId, updatedChat) => {
    set({ isLoading: true });
    try {
      const editedChat = await chatService.update(chatId, await get().getValidTokenApi(), updatedChat);
      set((state) => {
        const updatedChats = state.chats.map((chat) => (chat.id === chatId ? editedChat : chat));
        const isCurrentChat = state.currentChat?.id === chatId;

        return {
          chats: updatedChats,
          currentChat: isCurrentChat
            ? { ...editedChat, messages: state.currentMessages }
            : state.currentChat,

          currentMessages: isCurrentChat
            ? (editedChat.messages && editedChat.messages.length > 0
              ? editedChat.messages
              : state.currentMessages)
            : state.currentMessages,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addMessage: async (message) => {
    set({ isLoading: true });
    try {
      const newMessage = await messageService.save(message, await get().getValidTokenApi());
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.id === state.currentChat?.id
            ? { ...chat, messages: [...(chat.messages || []), newMessage], updatedAt: new Date() }
            : chat
        );
        return {
          chats: updatedChats,
          currentMessages: state.currentChat?.id === state.currentChat?.id ? [...state.currentMessages, newMessage] : state.currentMessages,
          currentChat: state.currentChat ? { ...state.currentChat, messages: [...(state.currentChat.messages || []), newMessage] } : null,
          isLoading: false,
        };
      });

      return newMessage;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  },

  deleteMessage: async (messageId) => {
    set({ isLoading: true });
    try {
  await messageService.delete(messageId, await get().getValidTokenApi());
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.id === state.currentChat?.id
            ? { ...chat, messages: (chat.messages || []).filter((msg) => msg.id !== messageId) }
            : chat
        );
        return {
          chats: updatedChats,
          currentMessages: state.currentChat?.id === state.currentChat?.id ? state.currentMessages.filter((msg) => msg.id !== messageId) : state.currentMessages,
          currentChat: state.currentChat ? { ...state.currentChat, messages: (state.currentChat.messages || []).filter((msg) => msg.id !== messageId) } : null,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  saveTrainingData: async (addData: ITrainingAiData, abortSignal?: AbortSignal) => {
    set({ isLoading: true });
    try {
      const response = await trainingAiService.saveTrainingData(addData, await get().getValidTokenApi(), abortSignal);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  deleteTrainingData: async (deleteData: ITrainingAiData, abortSignal?: AbortSignal) => {
    set({ isLoading: true });
    try {
      const response = await trainingAiService.deleteTrainingData(deleteData, await get().getValidTokenApi(), abortSignal);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  getAllNameDatabaseTables: async () => {
    set({ isLoading: true });
    try {
      const tables = await databaseInfoService.getAllTables(await get().getValidTokenApi());
      set({ isLoading: false });
      return tables;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  editGeneralServiceSetting: async (setting) => {
    try {
      const response = await settingDataService.updateGeneralServiceSetting(setting, await get().getValidTokenApi());

      if (response) {
        await get().refreshSettings();
      }

      return response;
    } catch (error) {
      console.error("Failed to edit general service setting:", error);
      return false;
    }
  },

  editMessage: async (messageId, updatedMessage) => {
    set({ isLoading: true });
    try {
      const editedMessage = await messageService.update(messageId, await get().getValidTokenApi(), updatedMessage);
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.id === state.currentChat?.id
            ? {
              ...chat,
              messages: (chat.messages || []).map((msg) => (msg.id === messageId ? editedMessage : msg)),
            }
            : chat
        );
        return {
          chats: updatedChats,
          currentMessages: state.currentChat?.id === state.currentChat?.id ? state.currentMessages.map((msg) => (msg.id === messageId ? editedMessage : msg)) : state.currentMessages,
          currentChat: state.currentChat
            ? {
              ...state.currentChat,
              messages: (state.currentChat.messages || []).map((msg) => (msg.id === messageId ? editedMessage : msg)),
            }
            : null,
          isLoading: false,
        };
      });

      return editedMessage;
    } catch (error) {
      set({ isLoading: false });
      return updatedMessage;
    }
  },

  editSqlMessage: async (sqlMessageId, updatedSql) => {
    set({ isLoading: true });
    try {
      const editedSqlMessage = await messageService.updateSql(sqlMessageId, updatedSql, await get().getValidTokenApi());

      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.id === state.currentChat?.id
            ? {
              ...chat,
              messages: (chat.messages || []).map((msg) => ({
                ...msg,
                sqlMessages: msg.sqlMessages.map((sqlMsg) =>
                  sqlMsg.id === sqlMessageId ? editedSqlMessage : sqlMsg
                ),
              })),
            }
            : chat
        );

        return {
          chats: updatedChats,
          currentMessages: state.currentChat?.id === state.currentChat?.id
            ? state.currentMessages.map((msg) => ({
              ...msg,
              sqlMessages: msg.sqlMessages.map((sqlMsg) =>
                sqlMsg.id === sqlMessageId ? editedSqlMessage : sqlMsg
              ),
            }))
            : state.currentMessages,
          currentChat: state.currentChat
            ? {
              ...state.currentChat,
              messages: (state.currentChat.messages || []).map((msg) => ({
                ...msg,
                sqlMessages: msg.sqlMessages.map((sqlMsg) =>
                  sqlMsg.id === sqlMessageId ? editedSqlMessage : sqlMsg
                ),
              })),
            }
            : null,
          isLoading: false,
        };
      });

      return editedSqlMessage;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  toggleTheme: () =>
    set((state) => ({
      currentTheme:
        state.currentTheme.palette.themePrimary === lightTheme.palette.themePrimary ? darkTheme : lightTheme,
    })),

  getCurrentUser: async (instance, account) => {
    set({ isUserDataLoading: true });

    try {
      if (!account || !instance) {
        return;
      }

      const { profile, photo } = await azureGraphService.getUserProfile(instance, account);

      set({
        userProfile: profile,
        userPhoto: photo
      });

      const profileNameParts = profile.displayName ? profile.displayName.split(' ') : [];
      const profileFirstName = profileNameParts[0] || get().currentUser.firstName;
      const profileLastName = profileNameParts.slice(1).join(' ') || get().currentUser.lastName;

      const updatedUser: IUser = {
        ...get().currentUser,
        id: profile.id || get().currentUser.id,
        firstName: profileFirstName,
        lastName: profileLastName,
        email: profile.mail || profile.userPrincipalName || get().currentUser.email,
      };

      set({ currentUser: updatedUser });

    } catch (error) {
      console.error('Error fetching user data from Graph:', error);
    } finally {
      set({ isUserDataLoading: false });
    }
  },

  getAllTenantUsers: async (instance, account) => {
    set({ isUserDataLoading: true });

    try {
      if (!account || !instance) {
        return;
      }

      const users = await azureGraphService.getAllUsers(instance, account);

      set({ azureUsers: users });
    } catch (error) {
      console.error('Error fetching users from Graph:', error);
    } finally {
      set({ isUserDataLoading: false });
    }
  },

  clearUserData: () => {
    const currentPhoto = get().userPhoto;
    if (currentPhoto) {
      URL.revokeObjectURL(currentPhoto);
    }

    set({
      azureUser: null,
      userPhoto: null,
      userProfile: null,
      currentUser: defaultUser,
      chats: [],
      currentChat: null,
      currentMessages: [],
      isInitializeStore: false,
    });
  },

  getAvailableTables: async () => {
    set({ isLoading: true });
    try {
      const availableTables = await databaseInfoService.getAvailableTables(await get().getValidTokenApi());
      set({ isLoading: false });
      return availableTables;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  executeSql: async (sql, abortSignal) => {
    set({ isLoading: true });
    try {
      const result = await databaseInfoService.executeSql(sql, await get().getValidTokenApi(), abortSignal);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw new Error("Failed to execute SQL");
    }
  },

  getCurrentUserId: () => {
    const state = get();
    return state.azureUser?.localAccountId || state.currentUser.id;
  },

  getUserPhotoById: async (userId: string, abortSignal?: AbortSignal) => {
    try {
      const state = get();
      const validToken = await get().getValidTokenApi();
      if (validToken) {
        const photoUrl = await azureGraphService.getUserPhoto(validToken, userId, abortSignal);

        if (photoUrl) {
          const updatedUsers = state.azureUsers.map(user =>
            user.id === userId ? { ...user, photoUrl } : user
          );

          const userExists = updatedUsers.some(user => user.id === userId);
          if (!userExists) {
            updatedUsers.push({
              id: userId,
              name: 'Unknown User',
              email: null,
              photoUrl
            });
          }

          set({ azureUsers: updatedUsers });
        }
        return photoUrl;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user photo:', error);
      return null;
    }
  },

  getDatabaseSchemaForEditor: async () => {
    set({ isLoading: true });
    try {
      const schema = await databaseInfoService.getDatabaseSchema(await get().getValidTokenApi());
      set({
        databaseSchema: schema,
        isLoading: false
      });

      return schema;
    } catch (error) {
      console.error('Error loading database schema for Schema Editor:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getServiceRegistrations: async () => {
    set({ isLoading: true });
    try {
      const registrations = await constructorService.getAllServices(await get().getValidTokenApi());
      set({ serviceRegistrations: registrations, isLoading: false });
      return registrations;
    } catch (error) {
      console.error('Error fetching service registrations:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getTablesByServiceId: async (serviceId) => {
    try {
      const tables = await constructorService.getTablesByServiceId(serviceId, await get().getValidTokenApi());
      return tables;
    } catch (error) {
      console.error('Error fetching tables by service ID:', error);
      throw error;
    }
  },

  createServiceTable: async (serviceTable, abortSignal) => {
    try {
      const createdTable = await constructorService.createServiceTable(serviceTable, await get().getValidTokenApi(), abortSignal);
      return createdTable;
    } catch (error) {
      console.error('Error creating service table:', error);
      throw error;
    }
  },

  updateServiceTable: async (serviceTableId, serviceTable, abortSignal) => {
    try {
      const updatedTable = await constructorService.updateServiceTable(serviceTableId, serviceTable, await get().getValidTokenApi(), abortSignal);
      return updatedTable;
    } catch (error) {
      console.error('Error updating service table:', error);
      throw error;
    }
  },

  deleteServiceTable: async (serviceTableId, abortSignal) => {
    try {
      const result = await constructorService.deleteServiceTable(serviceTableId, await get().getValidTokenApi(), abortSignal);
      return result;
    } catch (error) {
      console.error('Error deleting service table:', error);
      throw error;
    }
  },

  getAllServiceTables: async (abortSignal) => {
    try {
      const tables = await constructorService.getAllServiceTables(await get().getValidTokenApi(), abortSignal);
      return tables;
    } catch (error) {
      console.error('Error fetching all service tables:', error);
      throw error;
    }
  },

  setServiceRegistrations: (registrations) => set({ serviceRegistrations: registrations }),

  setDatabaseSchema: (schema) => set({ databaseSchema: schema }),

  getAllServiceTablesWithFields: async (abortSignal) => {
    set({ isLoading: true });
    try {
      const tables = await constructorService.getAllServiceTablesWithFields(await get().getValidTokenApi(), abortSignal);
      set({ serviceTables: tables, isLoading: false });
      return tables;
    } catch (error) {
      console.error('Error fetching all service tables with fields:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getAllServiceTableFields: async (abortSignal) => {
    set({ isLoading: true });
    try {
      const fields = await constructorService.getAllServiceTableFields(await get().getValidTokenApi(), abortSignal);
      set({ serviceTableFields: fields, isLoading: false });
      return fields;
    } catch (error) {
      console.error('Error fetching all service table fields:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getServiceTableFields: async (serviceTableId, abortSignal) => {
    try {
      const fields = await constructorService.getServiceTableFields(serviceTableId, await get().getValidTokenApi(), abortSignal);
      return fields;
    } catch (error) {
      console.error('Error fetching service table fields:', error);
      throw error;
    }
  },

  createServiceTableField: async (serviceTableField, abortSignal) => {
    set({ isLoading: true });
    try {
      const createdField = await constructorService.createServiceTableField(serviceTableField, await get().getValidTokenApi(), abortSignal);

      set((state) => ({
        serviceTableFields: [...state.serviceTableFields, createdField],
        isLoading: false
      }));

      return createdField;
    } catch (error) {
      console.error('Error creating service table field:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateServiceTableField: async (id, serviceTableField, abortSignal) => {
    set({ isLoading: true });
    try {
    const updatedField = await constructorService.updateServiceTableField(id, serviceTableField, await get().getValidTokenApi(), abortSignal);

      set((state) => ({
        serviceTableFields: state.serviceTableFields.map(field =>
          field.id === id ? updatedField : field
        ),
        isLoading: false
      }));

      return updatedField;
    } catch (error) {
      console.error('Error updating service table field:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteServiceTableField: async (id, abortSignal) => {
    set({ isLoading: true });
    try {
      const result = await constructorService.deleteServiceTableField(id, await get().getValidTokenApi(), abortSignal);

      if (result) {
        set((state) => ({
          serviceTableFields: state.serviceTableFields.filter(field => field.id !== id),
          isLoading: false
        }));
      }

      return result;
    } catch (error) {
      console.error('Error deleting service table field:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getServiceTableFieldByName: (serviceTableId, fieldName) => {
    const fields = get().serviceTableFields;
    return fields.find(field =>
      field.serviceTableId === serviceTableId &&
      field.name === fieldName
    ) || null;
  },

  getServiceTableFieldByTableAndFieldName: (tableName, fieldName) => {
    const { serviceRegistrations, serviceTableFields } = get();


    let serviceTable = null;
    for (const service of serviceRegistrations) {
      const foundTable = service.serviceTables.find(st => st.name === tableName);
      if (foundTable) {
        serviceTable = foundTable;
        break;
      }
    }

    if (!serviceTable) return null;

    const result = serviceTableFields.find(field =>
      field.serviceTableId === serviceTable.id &&
      field.name === fieldName
    ) || null;

    return result;
  },

  updateOrCreateServiceTableField: async (tableName, fieldName, updates, abortSignal) => {
    const { serviceRegistrations } = get();

    let serviceTable = null;
    for (const service of serviceRegistrations) {
      const foundTable = service.serviceTables.find(st => st.name === tableName);
      if (foundTable) {
        serviceTable = foundTable;
        break;
      }
    }

    if (!serviceTable) {
      throw new Error(`Service table not found for table: ${tableName}`);
    }

    const existingField = get().getServiceTableFieldByTableAndFieldName(tableName, fieldName);

    if (existingField) {
      const updatedField = { 
        ...existingField, 
        ...updates,
        contextMenuItems: updates.contextMenuItems !== undefined ? updates.contextMenuItems : existingField.contextMenuItems
      };
      return await get().updateServiceTableField(existingField.id, updatedField, abortSignal);
    } else {
      const newField: IServiceTableField = {
        id: 0,
        name: fieldName,
        displayName: updates.displayName || fieldName,
        isHidden: updates.isHidden || false,
        isAiContextGenerationEnabled: updates.isAiContextGenerationEnabled || false,
        urlTemplate: updates.urlTemplate || '',
        serviceTableId: serviceTable.id,
        contextMenuItems: updates.contextMenuItems || [],
        ...updates
      };
      return await get().createServiceTableField(newField, abortSignal);
    }
  },

  addChatUser: async (chatUser) => {
    set({ isLoading: true });
    try {
    const newChatUser = await chatService.saveChatUser(chatUser, await get().getValidTokenApi());

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatUser.chatId
            ? { ...chat, chatUsers: [...(chat.chatUsers || []), newChatUser] }
            : chat
        ),
        currentChat: state.currentChat?.id === chatUser.chatId
          ? { ...state.currentChat, chatUsers: [...(state.currentChat.chatUsers || []), newChatUser] }
          : state.currentChat,
        isLoading: false,
      }));

      return newChatUser;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createImplicitRelation: async (relation, abortSignal) => {
    try {
    const newRelation = await constructorService.createImplicitRelation(relation, await get().getValidTokenApi(), abortSignal);

      set((state) => ({
        serviceRegistrations: state.serviceRegistrations.map(service => ({
          ...service,
          serviceTables: service.serviceTables.map(table =>
            table.id === relation.serviceTableId
              ? {
                ...table,
                implicitRelationsAsPrimary: [...table.implicitRelationsAsPrimary, newRelation]
              }
              : table
          )
        }))
      }));

      return newRelation;
    } catch (error) {
      throw error;
    }
  },

  deleteImplicitRelation: async (relationId) => {
    set((state) => ({
      serviceRegistrations: state.serviceRegistrations.map(service => ({
        ...service,
        serviceTables: service.serviceTables.map(table => ({
          ...table,
          implicitRelationsAsPrimary: table.implicitRelationsAsPrimary.filter(rel => rel.id !== relationId)
        }))
      }))
    }));

    return true;
  },

  getAllImplicitRelations: async (abortSignal) => {
    try {
    const relations = await constructorService.getAllImplicitRelations(await get().getValidTokenApi(), abortSignal);
      set((state) => ({
        serviceRegistrations: state.serviceRegistrations.map(service => ({
          ...service,
          serviceTables: service.serviceTables.map(table => ({
            ...table,
            implicitRelationsAsPrimary: relations.filter(rel => rel.serviceTableId === table.id)
          }))
        }))
      }));
      return relations;
    } catch (error) {
      throw error;
    }
  },

  removeChatUser: async (chatUserId) => {
    set({ isLoading: true });
    try {
    const success = await chatService.deleteChatUser(chatUserId, await get().getValidTokenApi());

      if (success) {
        set((state) => ({
          chats: state.chats.map((chat) => ({
            ...chat,
            chatUsers: chat.chatUsers?.filter(user => user.id !== chatUserId) || []
          })),
          currentChat: state.currentChat
            ? {
              ...state.currentChat,
              chatUsers: state.currentChat.chatUsers?.filter(user => user.id !== chatUserId) || []
            }
            : state.currentChat,
          isLoading: false,
        }));
      }

      set({ isLoading: false });
      return success;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createFieldContextMenuItem: async (contextMenuItem, abortSignal) => {
    set({ isLoading: true });
    try {
    const createdItem = await constructorService.createFieldContextMenuItem(contextMenuItem, await get().getValidTokenApi(), abortSignal);
      
      set((state) => ({
        serviceTableFields: state.serviceTableFields.map(field =>
          field.id === contextMenuItem.serviceTableFieldId
            ? { ...field, contextMenuItems: [...field.contextMenuItems, createdItem] }
            : field
        ),
        isLoading: false
      }));

      return createdItem;
    } catch (error) {
      console.error('Error creating field context menu item:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateFieldContextMenuItem: async (id, contextMenuItem, abortSignal) => {
    set({ isLoading: true });
    try {
    const updatedItem = await constructorService.updateFieldContextMenuItem(id, contextMenuItem, await get().getValidTokenApi(), abortSignal);
      
      set((state) => ({
        serviceTableFields: state.serviceTableFields.map(field => ({
          ...field,
          contextMenuItems: field.contextMenuItems.map(item =>
            item.id === id ? updatedItem : item
          )
        })),
        isLoading: false
      }));

      return updatedItem;
    } catch (error) {
      console.error('Error updating field context menu item:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteFieldContextMenuItem: async (id, abortSignal) => {
    set({ isLoading: true });
    try {
    const result = await constructorService.deleteFieldContextMenuItem(id, await get().getValidTokenApi(), abortSignal);
      
      if (result) {
        set((state) => ({
          serviceTableFields: state.serviceTableFields.map(field => ({
            ...field,
            contextMenuItems: field.contextMenuItems.filter(item => item.id !== id)
          })),
          isLoading: false
        }));
      }

      return result;
    } catch (error) {
      console.error('Error deleting field context menu item:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Text insertion methods
  insertTextToInput: (text) => {
    set({ textToInsert: text });
  },

  getTextToInsert: () => {
    return get().textToInsert;
  },

  clearTextToInsert: () => {
    set({ textToInsert: '' });
  },

  // Chat loading state management
  setChatLoading: (chatId, isLoading) => {
    set((state) => ({
      chatLoadingStates: {
        ...state.chatLoadingStates,
        [chatId]: isLoading
      }
    }));
  },

  isChatLoading: (chatId) => {
    return get().chatLoadingStates[chatId] || false;
  },

  clearChatLoading: (chatId) => {
    set((state) => {
      const newLoadingStates = { ...state.chatLoadingStates };
      delete newLoadingStates[chatId];
      return { chatLoadingStates: newLoadingStates };
    });
  },
}));