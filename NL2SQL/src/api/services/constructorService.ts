import { FieldContextMenuItem, IServiceRegistry, IServiceTable, IServiceTableField, IServiceTableImplicitRelation } from "../model/IServiceRegistry";
import dataService from "./dataService";
import { IConstructorService } from "./interfaces";

const endPoint = `${import.meta.env.VITE_BASE_URL}/service-constructor`;

export class ConstructorServiceImplementation implements IConstructorService {
    async getAllServices(token: string, abortSignal?: AbortSignal): Promise<IServiceRegistry[]> {
        const response = await dataService.get<IServiceRegistry[]>(`${endPoint}/services`, token, abortSignal);
        return response;
    }

    async getTablesByServiceId(serviceId: number, token: string, abortSignal?: AbortSignal): Promise<IServiceTable[]> {
        const response = await dataService.get<IServiceTable[]>(`${endPoint}/services/${serviceId}/tables`, token, abortSignal);
        return response;
    }

    async updateServiceTable(serviceTableId: number, serviceTableToUpdate: IServiceTable, token: string, abortSignal?: AbortSignal): Promise<IServiceTable> {
        const response = await dataService.put<IServiceTable, IServiceTable>(`${endPoint}/services/tables/${serviceTableId}`, token, serviceTableToUpdate, abortSignal);
        return response;
    }

    async createServiceTable(serviceTableToCreate: IServiceTable, token: string, abortSignal?: AbortSignal): Promise<IServiceTable> {
        const response = await dataService.post<IServiceTable, IServiceTable>(`${endPoint}/services/tables`, token, serviceTableToCreate, abortSignal);
        return response;
    }

    async deleteServiceTable(serviceTableId: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/services/tables/${serviceTableId}`, token, abortSignal);
        return response;
    }

    async getAllServiceTables(token: string, abortSignal?: AbortSignal): Promise<IServiceTable[]> {
        const response = await dataService.get<IServiceTable[]>(`${endPoint}/services/tables/`, token, abortSignal);
        return response;
    }

    async getServiceTableFields(serviceTableId: number, token: string, abortSignal?: AbortSignal): Promise<IServiceTableField[]> {
        const response = await dataService.get<IServiceTableField[]>(`${endPoint}/services/tables/${serviceTableId}/fields`, token, abortSignal);
        return response;
    }

    async getAllServiceTableFields(token: string, abortSignal?: AbortSignal): Promise<IServiceTableField[]> {
        const response = await dataService.get<IServiceTableField[]>(`${endPoint}/services/tables/fields`, token, abortSignal);
        return response;
    }

    async getAllServiceTablesWithFields(token: string, abortSignal?: AbortSignal): Promise<IServiceTable[]> {
        const response = await dataService.get<IServiceTable[]>(`${endPoint}/services/tables/with_fields`, token, abortSignal);
        return response;
    }

    async createServiceTableField(serviceTableFieldToCreate: IServiceTableField, token: string, abortSignal?: AbortSignal): Promise<IServiceTableField> {
        const response = await dataService.post<IServiceTableField, IServiceTableField>(`${endPoint}/services/tables/fields`, token, serviceTableFieldToCreate, abortSignal);
        return response;
    }

    async updateServiceTableField(id: number, serviceTableFieldToUpdate: IServiceTableField, token: string, abortSignal?: AbortSignal): Promise<IServiceTableField> {
        const response = await dataService.put<IServiceTableField, IServiceTableField>(`${endPoint}/services/tables/fields/${id}`, token, serviceTableFieldToUpdate, abortSignal);
        return response;
    }

    async deleteServiceTableField(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/services/tables/fields/${id}`, token, abortSignal);
        return response;
    }

    async createImplicitRelation(relationToCreate: IServiceTableImplicitRelation, token: string, abortSignal?: AbortSignal): Promise<IServiceTableImplicitRelation> {
        const response = await dataService.post<IServiceTableImplicitRelation, IServiceTableImplicitRelation>(`${endPoint}/services/tables/implicit-relations`, token, relationToCreate, abortSignal);
        return response;
    }

    async deleteImplicitRelation(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/services/tables/implicit-relations/${id}`, token, abortSignal);
        return response;
    }

    async getAllImplicitRelations(token: string, abortSignal?: AbortSignal): Promise<IServiceTableImplicitRelation[]> {
        const response = await dataService.get<IServiceTableImplicitRelation[]>(`${endPoint}/services/tables/implicit-relations`, token, abortSignal);
        return response;
    }

    async createFieldContextMenuItem(contextMenuItemToCreate: FieldContextMenuItem, token: string, abortSignal?: AbortSignal): Promise<FieldContextMenuItem> {
        const response = await dataService.post<FieldContextMenuItem, FieldContextMenuItem>(`${endPoint}/services/tables/fields/context-menu-items`, token, contextMenuItemToCreate, abortSignal);
        return response;
    }

    async updateFieldContextMenuItem(id: number, contextMenuItemToUpdate: FieldContextMenuItem, token: string, abortSignal?: AbortSignal): Promise<FieldContextMenuItem> {
        const response = await dataService.put<FieldContextMenuItem, FieldContextMenuItem>(`${endPoint}/services/tables/fields/context-menu-items/${id}`, token, contextMenuItemToUpdate, abortSignal);
        return response;
    }

    async deleteFieldContextMenuItem(id: number, token: string, abortSignal?: AbortSignal): Promise<boolean> {
        const response = await dataService.remove<boolean>(`${endPoint}/services/tables/fields/context-menu-items/${id}`, token, abortSignal);
        return response;
    }
}