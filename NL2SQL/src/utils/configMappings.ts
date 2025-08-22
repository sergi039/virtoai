import { TimeUnitType } from "../api/constants";
import { IServiceData } from "../api/model";

export const convertSettingsToState = (settings: any): IServiceData[] => {
  const result: IServiceData[] = [];

  if (settings.apolloSetting) {
    result.push({
      id: 'apollo',
      serviceId: settings.apolloSetting.id,
      name: settings.apolloSetting.name || 'Apollo',
      isSelected: settings.apolloSetting.isActive,
      tables: settings.apolloSetting.tables || [],
      config: {
        apiKey: settings.apolloSetting.apiKey || '',
        apiUrl: settings.apolloSetting.apiUrl || '',
        setup: settings.apolloSetting.setup,
        domain: settings.apolloSetting.domain || '',
        emailDomain: settings.apolloSetting.emailDomain || '',
        name: settings.apolloSetting.nameUser || '',
        limit: settings.apolloSetting.limit || 10,
        duration: settings.apolloSetting.syncDuration || 60,
        timeUnit: settings.apolloSetting.syncUnit || TimeUnitType.MINUTES,
        matchFreshdesk: settings.apolloSetting.matchFreshdesk,
        matchPipedrive: settings.apolloSetting.matchPipedrive
      }
    });
  }

  if (settings.orttoSetting) {
    result.push({
      id: 'ortto',
      serviceId: settings.orttoSetting.id,
      name: settings.orttoSetting.name || 'Ortto',
      isSelected: settings.orttoSetting.isActive,
      tables: settings.orttoSetting.tables || [],
      config: {
        apiKey: settings.orttoSetting.apiKey || '',
        apiUrl: settings.orttoSetting.apiUrl || '',
        setup: settings.orttoSetting.setup,
        importData: settings.orttoSetting.importData,
        limit: settings.orttoSetting.limit,
        duration: settings.orttoSetting.syncDuration || 60,
        timeUnit: settings.orttoSetting.syncUnit || TimeUnitType.MINUTES,
        matchFreshdesk: settings.orttoSetting.matchFreshdesk,
        matchPipedrive: settings.orttoSetting.matchPipedrive
      }
    });
  }

  if (settings.freshdeskSetting) {
    result.push({
      id: 'freshdesk',
      serviceId: settings.freshdeskSetting.id,
      name: settings.freshdeskSetting.name || 'Freshdesk',
      isSelected: settings.freshdeskSetting.isActive,
      tables: settings.freshdeskSetting.tables || [],
      config: {
        apiKey: settings.freshdeskSetting.apiKey || '',
        apiUrl: settings.freshdeskSetting.apiUrl || '',
        entities: settings.freshdeskSetting.entities || 'all',
        conversations: settings.freshdeskSetting.conversations,
        since: settings.freshdeskSetting.since || '',
        until: settings.freshdeskSetting.until || '',
        duration: settings.freshdeskSetting.syncDuration || 60,
        timeUnit: settings.freshdeskSetting.syncUnit || TimeUnitType.MINUTES,
        batchSize: settings.freshdeskSetting.batchSize || 100,
        insecure: settings.freshdeskSetting.insecure,
        ticketId: settings.freshdeskSetting.ticketId,
        parallelThreads: settings.freshdeskSetting.parallelThreads || 5
      }
    });
  }

  if (settings.pipedriveSetting) {
    result.push({
      id: 'pipedrive',
      serviceId: settings.pipedriveSetting.id,
      name: settings.pipedriveSetting.name || 'Pipedrive',
      isSelected: settings.pipedriveSetting.isActive,
      tables: settings.pipedriveSetting.tables || [],
      config: {
        apiKey: settings.pipedriveSetting.apiKey || '',
        apiUrl: settings.pipedriveSetting.apiUrl || '',
        setup: settings.pipedriveSetting.setup,
        full: settings.pipedriveSetting.full,
        limit: settings.pipedriveSetting.limit,
        duration: settings.pipedriveSetting.syncDuration || 60,
        timeUnit: settings.pipedriveSetting.syncUnit || TimeUnitType.MINUTES,
        entities: settings.pipedriveSetting.entities ?
          settings.pipedriveSetting.entities.split(',') : ['all'],
        match: settings.pipedriveSetting.matchFreshdesk
      }
    });
  }

  return result;
};

export const convertStateToSettings = (serviceSettings: IServiceData[]): any => {
  const apolloSetting = serviceSettings.find(s => s.id === 'apollo');
  const orttoSetting = serviceSettings.find(s => s.id === 'ortto');
  const freshdeskSetting = serviceSettings.find(s => s.id === 'freshdesk');
  const pipedriveSetting = serviceSettings.find(s => s.id === 'pipedrive');

  return {
    apolloSetting: apolloSetting ? {
      id: apolloSetting.serviceId,
      name: apolloSetting.name,
      isActive: apolloSetting.isSelected,
      tables: apolloSetting.tables,
      apiKey: apolloSetting.config.apiKey || '',
      apiUrl: apolloSetting.config.apiUrl || '',
      setup: apolloSetting.config.setup,
      domain: apolloSetting.config.domain || null,
      emailDomain: apolloSetting.config.emailDomain || null,
      nameUser: apolloSetting.config.name || null,
      limit: apolloSetting.config.limit,
      syncDuration: apolloSetting.config.duration || 60,
      syncUnit: apolloSetting.config.timeUnit || TimeUnitType.MINUTES,
      matchFreshdesk: apolloSetting.config.matchFreshdesk,
      matchPipedrive: apolloSetting.config.matchPipedrive
    } : null,

    orttoSetting: orttoSetting ? {
      id: orttoSetting.serviceId,
      name: orttoSetting.name,
      isActive: orttoSetting.isSelected,
      tables: orttoSetting.tables,
      apiKey: orttoSetting.config.apiKey || '',
      apiUrl: orttoSetting.config.apiUrl || '',
      setup: orttoSetting.config.setup,
      importData: orttoSetting.config.importData,
      limit: orttoSetting.config.limit !== null ? orttoSetting.config.limit : 0,
      syncDuration: orttoSetting.config.duration || 60,
      syncUnit: orttoSetting.config.timeUnit || TimeUnitType.MINUTES,
      matchFreshdesk: orttoSetting.config.matchFreshdesk,
      matchPipedrive: orttoSetting.config.matchPipedrive
    } : null,

    freshdeskSetting: freshdeskSetting ? {
      id: freshdeskSetting.serviceId,
      name: freshdeskSetting.name,
      isActive: freshdeskSetting.isSelected,
      tables: freshdeskSetting.tables,
      apiKey: freshdeskSetting.config.apiKey || '',
      apiUrl: freshdeskSetting.config.apiUrl || '',
      entities: freshdeskSetting.config.entities,
      conversations: freshdeskSetting.config.conversations,
      since: freshdeskSetting.config.since,
      until: freshdeskSetting.config.until,
      syncDuration: freshdeskSetting.config.duration || 60,
      syncUnit: freshdeskSetting.config.timeUnit || TimeUnitType.MINUTES,
      insecure: freshdeskSetting.config.insecure,
      ticketId: freshdeskSetting.config.ticketId !== null ? freshdeskSetting.config.ticketId : null,
      parallelThreads: freshdeskSetting.config.parallelThreads,
      batchSize: freshdeskSetting.config.batchSize
    } : null,

    pipedriveSetting: pipedriveSetting ? {
      id: pipedriveSetting.serviceId,
      name: pipedriveSetting.name,
      isActive: pipedriveSetting.isSelected,
      tables: pipedriveSetting.tables,
      apiKey: pipedriveSetting.config.apiKey || '',
      apiUrl: pipedriveSetting.config.apiUrl || '',
      setup: pipedriveSetting.config.setup,
      full: pipedriveSetting.config.full,
      limit: pipedriveSetting.config.limit,
      syncDuration: pipedriveSetting.config.duration || 60,
      syncUnit: pipedriveSetting.config.timeUnit || TimeUnitType.MINUTES,
      entities: Array.isArray(pipedriveSetting.config.entities) ?
        pipedriveSetting.config.entities.join(',') : pipedriveSetting.config.entities,
      matchFreshdesk: pipedriveSetting.config.match
    } : null
  };
};