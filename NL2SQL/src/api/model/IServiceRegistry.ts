export interface IServiceRegistry {
    id: number;
    name: string;
    description: string | null;
    serviceTables: IServiceTable[];
}

export interface IServiceTable {
    id: number;
    name: string;
    isActive: boolean;
    serviceRegistryEntityId: number;
    tableFields: IServiceTableField[];
    implicitRelationsAsPrimary: IServiceTableImplicitRelation[];
}

export interface IServiceTableField {
    id: number;
    name: string;
    displayName: string;
    isHidden: boolean;
    isAiContextGenerationEnabled: boolean;
    urlTemplate: string;
    serviceTableId: number;
    contextMenuItems: FieldContextMenuItem[];
}

export interface IServiceTableImplicitRelation {
    id: number;
    serviceTableId: number;
    relatedServiceTableId: number;
    primaryTableColumn: string;
    relatedTableColumn: string;
    RelationType: string;
    sqlGenerationRuleId: number;
}

export interface FieldContextMenuItem {
    id: number;
    name: string;
    sortOrder: number;
    serviceTableFieldId: number;
}