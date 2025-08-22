import dataService from "./dataService";
import { IChat, IChatUser } from "../model";
import { IChatService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/chats`;

export class ChatServiceImplementation implements IChatService {

    async getAll(token: string, abortSignal?: AbortSignal): Promise<IChat[]> {
        const response = await dataService.get<IChat[]>(endPoint, token, abortSignal);
        return response;
    }

    async getAllWithMessagesByUserId(userId: string, token: string, abortSignal?: AbortSignal): Promise<IChat[]> {
        const response = await dataService.get<IChat[]>(`${endPoint}/messages/${userId}`, token, abortSignal);
        return response;
    }

    async get(id: number, token: string, abortSignal?: AbortSignal): Promise<IChat> {
        const response = await dataService.get<IChat>(`${endPoint}/${id}`, token, abortSignal);
        return response;
    }

    async save(chatToAdd: IChat, token: string, abortSignal?: AbortSignal): Promise<IChat> {
        const response = await dataService.post<IChat, IChat>(endPoint, token, chatToAdd, abortSignal);
        return response;
    }

    async saveChatUser(chatUserToAdd: IChatUser, token: string, abortSignal?: AbortSignal): Promise<IChatUser> {
        const response = await dataService.post<IChatUser, IChatUser>(`${endPoint}/users`, token, chatUserToAdd, abortSignal);
        return response;
    }

    async delete(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/${id}`, token, abortSignal);
        return response;
    }

    async deleteChatUser(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/users/${id}`, token, abortSignal);
        return response;
    }

    async update(id: number, token: string, chatToUpdate: IChat, abortSignal?: AbortSignal): Promise<IChat> {
        const response = await dataService.put<IChat, IChat>(`${endPoint}/${id}`, token, chatToUpdate, abortSignal);
        return response;
    }
}