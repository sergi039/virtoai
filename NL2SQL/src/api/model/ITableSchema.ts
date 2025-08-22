import { PostgreSQLFieldType } from "../constants/DatabaseInfo";
import { IServiceTableImplicitRelation } from "./IServiceRegistry";

export interface DatabaseSchemaResponse {
  databaseName: string;
  tables: ITableSchema[];
}

export interface ITableField {
  id: string;
  name: string;
  displayName?: string;
  type: PostgreSQLFieldType;
  isRequired: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  defaultValue?: string;
  maxLength?: number;
  precision?: number;
  scale?: number;
  description?: string;
  isHidden?: boolean;
  isAiContextGenerationEnabled?: boolean;
}

export interface ITableSchema {
  id: string;
  name: string;
  description?: string;
  fields: ITableField[];
  foreignKeys: IForeignKey[];
  createdAt: Date;
  updatedAt: Date;
  implicitRelations?: IServiceTableImplicitRelation[] | null;
}

export interface IForeignKey {
  constraintName: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}
