import { IMessage } from "./IMessage";

export interface IChat {
    id: number;
    title: string;
    userOwnerId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: IMessage[];
    chatUsers: IChatUser[];
}

export interface IChatUser {
    id: number;
    chatId: number;
    userId: string;
    userName: string;
    email: string;
    photoUrl?: string;
    joinedAt: Date;
}