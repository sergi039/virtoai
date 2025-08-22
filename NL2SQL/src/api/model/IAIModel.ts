export interface IAIModel {
    id: number;
    name: string;
    value: string;
    description?: string;
    isDefault: boolean;
}

export interface IRowData {
    key: string;
    value: any;
}

export interface IRequestGenerateFieldContext {
    tableName: string;
    fieldName: string;
    chatId: number;
    isFieldExist: boolean;
    rowData: IRowData[];
}

export interface GenerateClarifying {
    mainGeneratedQuery: string;
    questions: string[];
    suggests: string[];
}