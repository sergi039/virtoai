export interface ISqlGenerationRule {
    id: number;
    text: string;
    isActive: boolean;
    serviceTableId: number | null;
    updatedAt: Date;
}