import { GenerateClarifying, INlpQueryRequest, IRequestGenerateFieldContext } from "../model";
import { IGeneralNlpQueryResponse } from "../model/IGeneralNlpQueryResponse";
import dataService from "./dataService";
import { IAiGenerateService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/ai-generate`;

export class AiGenerateServiceImplementation implements IAiGenerateService {
    
    async generateSql(requestToAi: INlpQueryRequest, token: string, abortSignal?: AbortSignal): Promise<IGeneralNlpQueryResponse> {
        const response = await dataService.post<IGeneralNlpQueryResponse, INlpQueryRequest>(
            `${endPoint}/generate-sql`,
            token,
            requestToAi,
            abortSignal
        );

        return response;
    }

    async generateFieldContext(requestToAi: IRequestGenerateFieldContext, token: string, abortSignal?: AbortSignal): Promise<string[]> {
        const response = await dataService.post<string[], IRequestGenerateFieldContext>(
            `${endPoint}/generate-field-context`,
            token,
            requestToAi,
            abortSignal
        );

        return response;
    }

    async isCheckBrokeChain(requestToAi: INlpQueryRequest, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.post<boolean, INlpQueryRequest>(
            `${endPoint}/check-broke-chain`,
            token,
            requestToAi,
            abortSignal
        );

        return response;
    }
    
    async generateClarifying(requestToAi: INlpQueryRequest, token: string, abortSignal?: AbortSignal): Promise<GenerateClarifying> {
        const response = await dataService.post<GenerateClarifying, INlpQueryRequest>(
            `${endPoint}/generate-clarifying`,
            token,
            requestToAi,
            abortSignal
        );

        return response;
    }
}