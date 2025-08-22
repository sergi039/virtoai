import { ISqlOperationResult } from "../model/ISqlOperationResult";
import { DatabaseSchemaResponse } from "../model/ITableSchema";
import dataService from "./dataService";
import { IDatabaseInfoService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/databases`;

export class DatabaseInfoImplementation implements IDatabaseInfoService {

  async getAllTables(token: string, abortSignal?: AbortSignal): Promise<string[]> {
    const response = await dataService.get<string[]>(`${endPoint}/tables`, token, abortSignal);
    return response;
  }

  async getAvailableTables(token: string, abortSignal?: AbortSignal): Promise<string[]> {
    const response = await dataService.get<string[]>(`${endPoint}/tables/available`, token, abortSignal);
    return response;
  }

  async executeSql(sql: string, token: string, abortSignal?: AbortSignal): Promise<ISqlOperationResult> {
    const response = await dataService.post<ISqlOperationResult>(`${endPoint}/sql/execute`, token, sql, abortSignal);
    return response;
  }

  async getDatabaseSchema(token: string, abortSignal?: AbortSignal): Promise<DatabaseSchemaResponse> {
    const response = await dataService.get<DatabaseSchemaResponse>(`${endPoint}/schema`, token, abortSignal);

    response.tables.forEach(table => {
      table.createdAt = new Date(table.createdAt);
      table.updatedAt = new Date(table.updatedAt);
    });
    
    return response;
  }
}