import { INlpQueryResponse } from "./INlpQueryResponse";

export interface IGeneralNlpQueryResponse {
    sqlQueries: Array<INlpQueryResponse>;
    needsClarification?: boolean;
    questions?: string[];
}