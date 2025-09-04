import { IApolloSetting, IChat, IFreshdeskSetting, IGeneralServiceSetting, IMessage, IOrttoSetting, IPipedriveSetting, ISpeech, ISqlMessage, INlpQueryRequest, IUserProfile, IChatUser, IRequestGenerateFieldContext, GenerateClarifying } from "../model";
import { IGeneralNlpQueryResponse } from "../model/IGeneralNlpQueryResponse";
import { ISqlGenerationRule } from "../model/ISqlGenerationRule";
import { ITrainingAiData } from "../model/ITrainingAiData";
import { DatabaseSchemaResponse } from "../model/ITableSchema";
import { FieldContextMenuItem, IServiceRegistry, IServiceTable, IServiceTableField, IServiceTableImplicitRelation } from "../model/IServiceRegistry";
import { ISqlOperationResult } from "../model/ISqlOperationResult";

export interface IChatService {
    getAll: (token: string, abortSignal?: AbortSignal) => Promise<IChat[]>;
    getAllWithMessagesByUserId: (userId: string, token: string, abortSignal?: AbortSignal) => Promise<IChat[]>;
    get: (id: number, token: string, abortSignal?: AbortSignal) => Promise<IChat>;
    save: (chatToAdd: IChat, token: string,  abortSignal?: AbortSignal)=> Promise<IChat>;
    saveChatUser: (chatUserToAdd: IChatUser, token: string,  abortSignal?: AbortSignal)=> Promise<IChatUser>;
    delete: (id: number, token: string,  abortSignal?: AbortSignal)=> Promise<boolean>;
    deleteChatUser: (id: number, token: string,  abortSignal?: AbortSignal)=> Promise<boolean>;
    update: (id: number, token: string,  chatToUpdate: IChat, abortSignal?: AbortSignal) => Promise<IChat>;
}

export interface IMessageService {
    save: (messageToCreate: IMessage, token: string, abortSignal?: AbortSignal)=> Promise<IMessage>;
    updateSql: (id: number, messageToUpdate: ISqlMessage, token: string, abortSignal?: AbortSignal) => Promise<ISqlMessage>;
    delete: (id: number, token: string, abortSignal?: AbortSignal)=> Promise<boolean>;
    update: (id: number, token: string, extension: IMessage, abortSignal?: AbortSignal) => Promise<IMessage>;
}

export interface IConstructorService {
    getAllServices: (token: string, abortSignal?: AbortSignal) => Promise<IServiceRegistry[]>;
    getTablesByServiceId: (serviceId: number, token: string, abortSignal?: AbortSignal) => Promise<IServiceTable[]>;
    updateServiceTable: (serviceTableId: number, serviceTableToUpdate: IServiceTable, token: string, abortSignal?: AbortSignal) => Promise<IServiceTable>;
    createServiceTable: (serviceTableToCreate: IServiceTable, token: string, abortSignal?: AbortSignal) => Promise<IServiceTable>;
    deleteServiceTable: (serviceTableId: number, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    getAllServiceTables: (token: string, abortSignal?: AbortSignal) => Promise<IServiceTable[]>;
    getAllServiceTablesWithFields: (token: string, abortSignal?: AbortSignal) => Promise<IServiceTable[]>;
    getServiceTableFields: (serviceTableId: number, token: string, abortSignal?: AbortSignal) => Promise<IServiceTableField[]>;
    createServiceTableField: (serviceTableFieldToCreate: IServiceTableField, token: string, abortSignal?: AbortSignal) => Promise<IServiceTableField>;
    updateServiceTableField: (id: number, serviceTableFieldToUpdate: IServiceTableField, token: string, abortSignal?: AbortSignal) => Promise<IServiceTableField>;
    deleteServiceTableField: (id: number, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    getAllServiceTableFields: (token: string, abortSignal?: AbortSignal) => Promise<IServiceTableField[]>;
    createImplicitRelation: (relationToCreate: IServiceTableImplicitRelation, token: string, abortSignal?: AbortSignal) => Promise<IServiceTableImplicitRelation>;
    deleteImplicitRelation: (id: number, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    getAllImplicitRelations: (token: string, abortSignal?: AbortSignal) => Promise<IServiceTableImplicitRelation[]>;
    createFieldContextMenuItem: (contextMenuItemToCreate: FieldContextMenuItem, token: string, abortSignal?: AbortSignal) => Promise<FieldContextMenuItem>;
    updateFieldContextMenuItem: (id: number, contextMenuItemToUpdate: FieldContextMenuItem, token: string, abortSignal?: AbortSignal) => Promise<FieldContextMenuItem>;
    deleteFieldContextMenuItem: (id: number, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
}

export interface IAiGenerateService {
    generateFieldContext: (requestToAi: IRequestGenerateFieldContext, token: string, abortSignal?: AbortSignal) => Promise<string[]>;
    generateSql: (requestToAi: INlpQueryRequest, token: string, abortSignal?: AbortSignal) => Promise<IGeneralNlpQueryResponse>;
    isCheckBrokeChain: (requestToAi: INlpQueryRequest, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    generateClarifying: (requestToAi: INlpQueryRequest, token: string, abortSignal?: AbortSignal) => Promise<GenerateClarifying>;
}

export interface ITrainingAiService {
    saveTrainingData: (trainingDataToCreate: ITrainingAiData, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    deleteTrainingData: (trainingDataToDelete: ITrainingAiData, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
}

export interface ISpeechService {
    getToken(token: string, abortSignal?: AbortSignal): Promise<ISpeech>;
}

export interface IDatabaseInfoService {
    getAllTables: (token: string, abortSignal?: AbortSignal) => Promise<string[]>;
    getAvailableTables: (token: string, abortSignal?: AbortSignal) => Promise<string[]>;
    executeSql: (sql: string, token: string, abortSignal?: AbortSignal) => Promise<ISqlOperationResult>;
    getDatabaseSchema: (token: string, abortSignal?: AbortSignal) => Promise<DatabaseSchemaResponse>;
}

export interface ISettingDataService {
    getGeneralServiceSetting: (token: string, abortSignal?: AbortSignal) => Promise<IGeneralServiceSetting>;
    updateGeneralServiceSetting: (generalServiceSettingToUpdate: IGeneralServiceSetting, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    syncApolloSettings: (setting: IApolloSetting, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    syncOrttoSettings: (setting: IOrttoSetting, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    syncPipedriveSettings: (setting: IPipedriveSetting, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    syncFreshdeskSettings: (setting: IFreshdeskSetting, token: string, abortSignal?: AbortSignal) => Promise<boolean>;
    
    getAllRules: (token: string, abortSignal?: AbortSignal) => Promise<ISqlGenerationRule[]>;
    saveRule: (ruleToCteate: ISqlGenerationRule, token: string, abortSignal?: AbortSignal)=> Promise<ISqlGenerationRule>;
    updateRule: (id: number, ruleToUpdate: ISqlGenerationRule, token: string, abortSignal?: AbortSignal) => Promise<ISqlGenerationRule>;
    delete: (id: number, token: string, abortSignal?: AbortSignal)=> Promise<boolean>;
}

export interface IAzureGraphService {
    getUserProfile: (instance: any, account: any, abortSignal?: AbortSignal) => Promise<{ profile: any; photo: string | null }>;
    getUserPhoto: (accessToken: string, userId: string, abortSignal?: AbortSignal) => Promise<string | null>;
    getAccessToken: (instance: any, account: any, scopes?: string[]) => Promise<string>;
    getAllUsers(instance: any, account: any, abortSignal?: AbortSignal): Promise<IUserProfile[]>;
}