import dataService from "./dataService";
import { IMessage, ISqlMessage } from "../model";
import { IMessageService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/messages`;

export class MessageServiceImplementation implements IMessageService {

    async updateSql(id: number, messageSqlToUpdate: ISqlMessage, token: string, abortSignal?: AbortSignal): Promise<ISqlMessage> {
        const response = await dataService.put<ISqlMessage, ISqlMessage>(`${endPoint}/sql-content/${id}`, token, messageSqlToUpdate, abortSignal);
        return response;
    }

    async save(messageToCreate: IMessage, token: string, abortSignal?: AbortSignal): Promise<IMessage> {
        const response = await dataService.post<IMessage, IMessage>(endPoint, token, messageToCreate, abortSignal);
        return response;
    }

    async delete(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/${id}`, token, abortSignal);
        return response;
    }

    async update(id: number, token: string, messageToUpdate: IMessage, abortSignal?: AbortSignal): Promise<IMessage> {
        const response = await dataService.put<IMessage, IMessage>(`${endPoint}/${id}`, token, messageToUpdate, abortSignal);
        return response;
    }
}