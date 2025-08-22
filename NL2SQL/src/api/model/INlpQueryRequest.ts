export interface INlpQueryRequest {
    query: string;
    dataSources: string[];
    model: string;
    chatId: number;
}