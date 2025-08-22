import { ITrainingAiData } from "../model/ITrainingAiData";
import dataService from "./dataService";
import { ITrainingAiService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/training-data`;

export class TrainingAiServiceImplementation implements ITrainingAiService {
    async saveTrainingData (trainingDataToCreate: ITrainingAiData, token: string, abortSignal?: AbortSignal) {
        const response = await dataService.post<boolean, ITrainingAiData>(endPoint, token, trainingDataToCreate, abortSignal);
        return response;
    }
}