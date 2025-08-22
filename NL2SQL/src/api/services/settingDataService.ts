import { IApolloSetting, IFreshdeskSetting, IGeneralServiceSetting, IOrttoSetting, IPipedriveSetting } from "../model";
import { ISqlGenerationRule } from "../model/ISqlGenerationRule";
import dataService from "./dataService";
import { ISettingDataService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/settings`;

export class SettingDataImplementation implements ISettingDataService {

    async getGeneralServiceSetting(token: string, abortSignal?: AbortSignal): Promise<IGeneralServiceSetting> {
        const response = await dataService.get<IGeneralServiceSetting>(endPoint, token, abortSignal);
        return response;
    }

    async updateGeneralServiceSetting(generalServiceSettingToUpdate: IGeneralServiceSetting, token: string, abortSignal?: AbortSignal) {
        const response = dataService.put<boolean, IGeneralServiceSetting>(endPoint, token, generalServiceSettingToUpdate, abortSignal);
        return response;
    }

    async syncApolloSettings(setting: IApolloSetting, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = dataService.post<boolean, IApolloSetting>(`${endPoint}/apollo/sync`, token, setting, abortSignal);
        return response;
    }
    
    async syncOrttoSettings(setting: IOrttoSetting, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = dataService.post<boolean, IOrttoSetting>(`${endPoint}/ortto/sync`, token, setting, abortSignal);
        return response;
    }

    async syncPipedriveSettings(setting: IPipedriveSetting, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = dataService.post<boolean, IPipedriveSetting>(`${endPoint}/pipedrive/sync`, token, setting, abortSignal);
        return response;
    }

    async syncFreshdeskSettings(setting: IFreshdeskSetting, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = dataService.post<boolean, IFreshdeskSetting>(`${endPoint}/freshdesk/sync`, token, setting, abortSignal);
        return response;
    }

    async getAllRules(token: string, abortSignal?: AbortSignal): Promise<ISqlGenerationRule[]> {
        const response = await dataService.get<ISqlGenerationRule[]>(`${endPoint}/sql-generation-rules`, token, abortSignal);
        return response;
    }

    async saveRule(ruleToCreate: ISqlGenerationRule, token: string, abortSignal?: AbortSignal): Promise<ISqlGenerationRule> {
        const response = await dataService.post<ISqlGenerationRule, ISqlGenerationRule>(`${endPoint}/sql-generation-rules`, token, ruleToCreate, abortSignal);
        return response;
    }

    async updateRule(id: number, ruleToUpdate: ISqlGenerationRule, token: string, abortSignal?: AbortSignal): Promise<ISqlGenerationRule> {
        const response = await dataService.put<ISqlGenerationRule, ISqlGenerationRule>(`${endPoint}/sql-generation-rules/${id}`, token, ruleToUpdate, abortSignal);
        return response;
    }

    async delete(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/sql-generation-rules/${id}`, token, abortSignal);
        return response;
    }
}