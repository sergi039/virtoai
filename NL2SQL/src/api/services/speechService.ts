import dataService from "./dataService";
import { ISpeech } from "../model";
import { ISpeechService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/speech-service`;

export class SpeechServiceImplementation implements ISpeechService {
    async getToken(token: string, abortSignal?: AbortSignal): Promise<ISpeech> {
        const response = await dataService.get<ISpeech>(`${endPoint}/auth-token`, token, abortSignal);
        return response;
    }
}