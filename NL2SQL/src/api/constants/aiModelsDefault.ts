import strings from "../../Ioc/en-us";
import { IAIModel } from "../model";

export const aiModelsDefault: IAIModel[] = [
    { id: 1, name: strings.AIModel.chatGPT, value: "openai", description: 'GPT-5 model', isDefault: true },
    { id: 2, name: strings.AIModel.claude, value: "openrouter", description: 'Claude model from openrouter', isDefault: false },
    { id: 3, name: strings.AIModel.gemini, value: "gemini", description: 'Gemini', isDefault: false },
];