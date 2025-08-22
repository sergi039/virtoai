export interface INlpQueryResponse {
    sql: string;
    results: Array<Record<string, any>>;
    modelName: string;
    isSyntaxError: boolean;
    errorMessage?: string;
}