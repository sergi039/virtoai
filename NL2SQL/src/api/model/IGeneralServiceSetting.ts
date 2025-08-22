export interface IGeneralServiceSetting {
    IOrttoSetting: IOrttoSetting,
    IPipedriveSetting: IPipedriveSetting,
    IFreshdeskSetting: IFreshdeskSetting,
    IApolloSetting: IApolloSetting,
}

export interface IOrttoSetting {
    id: number,
    name: string,
    countRecords: number;
    isActive: boolean,
    tables: string[],
    syncDuration: number,
    syncUnit: string,
    lastSyncTime?: Date | null,
    lastSyncCount?: number,
    apiKey: string,
    apiUrl: string,
    setup: boolean,
    importData: boolean,
    limit: number,
    matchFreshdesk: boolean,
    matchPipedrive: boolean
}

export interface IPipedriveSetting {
    id: number,
    name: string,
    countRecords: number;
    isActive: boolean,
    tables: string[],
    syncDuration: number,
    syncUnit: string,
    lastSyncTime?: Date | null,
    lastSyncCount?: number,
    apiKey: string,
    apiUrl: string,
    setup: boolean,
    limit: number,
    full: boolean,
    entities: string,
    matchFreshdesk: boolean,
}

export interface IFreshdeskSetting {
    id: number,
    name: string,
    countRecords: number;
    isActive: boolean,
    tables: string[],
    syncDuration: number,
    syncUnit: string,
    lastSyncTime?: Date | null,
    lastSyncCount?: number,
    entities: string,
    apiKey: string,
    apiUrl: string,
    conversations: boolean,
    since: string,
    until: string,
    insecure: boolean,
    ticketId: number,
    parallelThreads: number,
    batchSize: number,
}

export interface IApolloSetting {
    id: number,
    name: string,
    countRecords: number;
    isActive: boolean,
    tables: string[],
    syncDuration: number,
    lastSyncTime?: Date | null,
    lastSyncCount?: number,
    syncUnit: string,
    apiKey: string,
    apiUrl: string,
    setup: boolean,
    domain: string,
    emailDomain: string,
    nameUser: string,
    limit: number,
    matchFreshdesk: boolean,
    matchPipedrive: boolean,
}