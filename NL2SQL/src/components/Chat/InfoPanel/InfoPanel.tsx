import { styled, Stack, Text, Spinner, IconButton } from '@fluentui/react';
import type { IInfoPanelProps, IInfoPanelStyleProps, IInfoPanelStyles } from './InfoPanel.types';
import { getStyles, getClassNames } from './InfoPanel.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';
import { ServiceIcons } from '../../../api/constants/serviceIcons';
import { useEffect, useState } from 'react';
import { convertSettingsToState, convertStateToSettings } from '../../../utils/configMappings';
import toast from 'react-hot-toast';

const InfoPanelBase: React.FunctionComponent<IInfoPanelProps> = ({ children, theme: customTheme }) => {
  const { 
    currentTheme, 
    settings, 
    getAllSettings,
    syncApolloSettings,
    syncOrttoSettings,
    syncFreshdeskSettings,
    syncPipedriveSettings,
    refreshSettings
  } = useNL2SQLStore();
  const styleProps: IInfoPanelStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncingServices, setSyncingServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if(settings == null) {
        await getAllSettings();
      }
      setIsLoading(false);
    };

    if (settings) {
      fetchData();
    }
  }, [settings]);

  const handleSyncService = async (serviceKey: string) => {
    const serviceId = serviceKey.toLowerCase().replace('setting', '');
    
    setSyncingServices(prev => new Set(prev).add(serviceId));
    
    try {
      if (!settings) return;
      
      const services = convertSettingsToState(settings);
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const settingsToSync = convertStateToSettings([service]);
      let success = false;

      switch (serviceId) {
        case 'apollo':
          if (settingsToSync.apolloSetting) {
            success = await syncApolloSettings(settingsToSync.apolloSetting);
          }
          break;
        case 'ortto':
          if (settingsToSync.orttoSetting) {
            success = await syncOrttoSettings(settingsToSync.orttoSetting);
          }
          break;
        case 'freshdesk':
          if (settingsToSync.freshdeskSetting) {
            success = await syncFreshdeskSettings(settingsToSync.freshdeskSetting);
          }
          break;
        case 'pipedrive':
          if (settingsToSync.pipedriveSetting) {
            success = await syncPipedriveSettings(settingsToSync.pipedriveSetting);
          }
          break;
      }

      if (success) {
        await refreshSettings();
        toast.success(strings.InfoPanel.syncSuccess);
      } else {
        toast.error(strings.InfoPanel.syncError);
      }
    } catch (error) {
      toast.error(strings.InfoPanel.syncError);
    } finally {
      setSyncingServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
    }
  };

  const formatDateToLocalTime = (utcDate: Date | string | null | undefined): string => {
    if (!utcDate) return strings.InfoPanel.noSyncData;

    try {
      let date: Date;
      if (typeof utcDate === 'string') {
        const utcString = utcDate.includes('Z') ? utcDate : utcDate + 'Z';
        date = new Date(utcString);
      } else {
        date = utcDate;
      }

      if (isNaN(date.getTime())) {
        return strings.InfoPanel.noSyncData;
      }

      return date.toLocaleString(navigator.language || 'en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return strings.InfoPanel.noSyncData;
    }
  };

  const getServiceIcon = (serviceName: string, serviceKey: string) => {
    const key = serviceKey.toLowerCase().replace('setting', '');

    if (ServiceIcons[key as keyof typeof ServiceIcons]) {
      return ServiceIcons[key as keyof typeof ServiceIcons];
    }

    const name = serviceName.toLowerCase();
    if (name.includes('freshdesk')) return ServiceIcons.freshdesk;
    if (name.includes('apollo')) return ServiceIcons.apollo;
    if (name.includes('pipedrive')) return ServiceIcons.pipedrive;
    if (name.includes('ortto')) return ServiceIcons.ortto;

    return ServiceIcons.default;
  };

  const formatRecordCount = (count: number | undefined): string => {
    if (count === undefined || count === null) return strings.InfoPanel.noData;
    if (count >= 1000000) return `+${(count / 1000000).toFixed(1)}${strings.InfoPanel.recordsM}`;
    if (count >= 1000) return `+${(count / 1000).toFixed(1)}${strings.InfoPanel.recordsK}`;
    return `+${count} ${strings.InfoPanel.records}`;
  };

  const formatTotalRecordCount = (count: number | undefined): string => {
    if (count === undefined || count === null) return strings.InfoPanel.noData;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return `${count}`;
  };

  const getActiveServices = () => {
    if (!settings) return [];

    return Object.entries(settings).filter(([, value]) => {
      return typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'lastSyncTime' in value &&
        'isActive' in value &&
        value.isActive === true;
    });
  };

  const activeServices = getActiveServices();

  if (!settings || activeServices.length === 0) {
    return null;
  }

  return (
    <div className={classNames.root}>
      <div className={classNames.panelContainer}>
        <div className={classNames.panelContent}>
          {children || (
            <Stack>
              {isLoading ? (
                <Spinner label={strings.InfoPanel.loading} />
              ) : (
                <div className={classNames.servicesGrid}>
                  {activeServices.map(([key, value]) => {
                    const serviceId = key.toLowerCase().replace('setting', '');
                    const isSyncing = syncingServices.has(serviceId);
                    
                    return (
                      <div key={key} className={classNames.serviceCard}>
                        <div className={classNames.serviceIcon}>
                          {getServiceIcon(value.name, key)}
                        </div>
                        <div className={classNames.serviceInfo}>
                          <Text className={classNames.serviceName}>
                            {value.name} ({formatTotalRecordCount(value.countRecords)})
                          </Text>
                          <div className={classNames.serviceDetails}>
                            <Text className={classNames.syncTime}>
                              {formatDateToLocalTime(value.lastSyncTime)}
                            </Text>
                            <div className={classNames.recordCounts}>
                              <Text className={classNames.recordCount}>
                                {formatRecordCount(value.lastSyncCount)}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <IconButton
                          className={classNames.syncButton}
                          iconProps={{
                            iconName: isSyncing ? 'Sync' : 'Refresh',
                            className: `${classNames.syncButtonIcon} ${isSyncing ? classNames.spinning : ''}`
                          }}
                          title={isSyncing ? 'Syncing...' : 'Sync data'}
                          disabled={isSyncing}
                          onClick={() => handleSyncService(key)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Stack>
          )}
        </div>
      </div>
    </div>
  );
};

export const InfoPanel = styled<IInfoPanelProps, IInfoPanelStyleProps, IInfoPanelStyles>(
  InfoPanelBase,
  getStyles,
  undefined,
  { scope: 'InfoPanel' }
);