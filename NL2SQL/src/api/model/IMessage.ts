export interface IMessage {
    id: number;
    text: string | null;
    previousMessageId: number | null;
    combinedQuery: string | null;
    type: string;
    suggestions: string;
    followUpQuestions: string;
    isUser: boolean;
    isLoading?: boolean | null;
    createdAt: Date;
    chatId: number;
    sqlMessages: ISqlMessage[];
}

export interface ISqlMessage {
    id: number;
    sql: string | null;
    text: string;
    isSyntaxError: boolean;
    errorMessage: string | null;
    model: string;
    isLoading?: boolean | null;
    createdAt: Date;
    messageId: number;
    reaction: ReactionType;
}

export enum ReactionType {
    None = "None",
    Like = "Like",
    Dislike = "Dislike",
}