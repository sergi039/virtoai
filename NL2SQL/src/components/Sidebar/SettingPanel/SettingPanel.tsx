import {
  Panel,
  PanelType,
  Stack,
  Label,
  PrimaryButton,
  DefaultButton,
  Separator,
  Spinner,
  SpinnerSize,
  styled,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import strings from '../../../Ioc/en-us';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import {
  ISettingPanelProps,
  ISettingPanelStyleProps,
  ISettingPanelStyles,
} from './SettingPanel.types';
import { getClassNames, getStyles } from './SettingPanel.styles';
import { IServiceData } from '../../../api/model';
import { TimeUnitType } from '../../../api/constants';
import { convertSettingsToState, convertStateToSettings } from '../../../utils/configMappings';
import { ApolloConfig } from './ApolloConfig';
import { OrttoConfig } from './OrttoConfig';
import { FreshdeskConfig } from './FreshdeskConfig';
import { PipedriveConfig } from './PipedriveConfig';
import { SchemaEditor } from './SchemaEditor';

const SettingPanelBase: React.FunctionComponent<ISettingPanelProps> = ({
  theme: customTheme,
  isOpen,
  onDismiss,
}) => {
  const { currentTheme, getAllSettings,
    editGeneralServiceSetting, syncApolloSettings, syncOrttoSettings,
    syncFreshdeskSettings, syncPipedriveSettings, settings, serviceRegistrations, getDatabaseSchemaForEditor
  } = useNL2SQLStore();
  const [services, setServices] = useState<IServiceData[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeUnits, setTimeUnits] = useState<{ [serviceId: string]: { [field: string]: TimeUnitType } }>({});
  const [syncResult, setSyncResult] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [saveResult, setSaveResult] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('');

  const theme = customTheme || currentTheme;
  const styleProps: ISettingPanelStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);

  useEffect(() => {
    if (syncResult || saveResult || errorMessage) {
      const timer = setTimeout(() => {
        setSyncResult(null);
        setSaveResult(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [syncResult, saveResult, errorMessage]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (settings == null) {
          await getAllSettings();
        }

        await getDatabaseSchemaForEditor();

        if (settings) {
          const convertedServices = convertSettingsToState(settings);

          const filteredServices = convertedServices.filter(service =>
            serviceRegistrations.some(registration => registration.name === service.name)
          );

          setServices(filteredServices);

          const initialTimeUnits: { [serviceId: string]: { [field: string]: TimeUnitType } } = {};
          filteredServices.forEach(service => {
            initialTimeUnits[service.id] = {
              duration: service.config.timeUnit || TimeUnitType.MINUTES,
              timeout: TimeUnitType.MINUTES
            };
          });
          setTimeUnits(initialTimeUnits);

          if (filteredServices.length > 0 && !activeServiceId) {
            setActiveServiceId(filteredServices[0].id);
            setSelectedTab(filteredServices[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [getAllSettings, getDatabaseSchemaForEditor, isOpen]);

  const handleServiceChange = (serviceId: string) => {
    if (serviceId === 'add-service') {
      setErrorMessage('Add Service functionality is not yet implemented');
      return;
    }
    setActiveServiceId(serviceId);
    setSelectedTab(serviceId);
  };

  const handleServiceConfigChange = (serviceId: string, fieldName: string, value: any) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, config: { ...service.config, [fieldName]: value } }
          : service
      )
    );
  };

  const handleTimeUnitChange = (serviceId: string, fieldName: string, unit: TimeUnitType) => {
    setTimeUnits(prevUnits => ({
      ...prevUnits,
      [serviceId]: {
        ...(prevUnits[serviceId] || {}),
        [fieldName]: unit
      }
    }));

    if (fieldName === 'duration') {
      handleServiceConfigChange(serviceId, 'timeUnit', unit);
    }
  };

  const handleSyncService = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const settings = convertStateToSettings([service]);
    let success = false;

    try {
      setIsLoading(true);
      setSyncResult(null);
      setSaveResult(null);
      setErrorMessage(null);

      switch (serviceId) {
        case 'apollo':
          if (settings.apolloSetting) success = await syncApolloSettings(settings.apolloSetting);
          break;
        case 'ortto':
          if (settings.orttoSetting) success = await syncOrttoSettings(settings.orttoSetting);
          break;
        case 'freshdesk':
          if (settings.freshdeskSetting) success = await syncFreshdeskSettings(settings.freshdeskSetting);
          break;
        case 'pipedrive':
          if (settings.pipedriveSetting) success = await syncPipedriveSettings(settings.pipedriveSetting);
          break;
      }

      setSyncResult({
        message: success
          ? `${service.name} data synchronized successfully!`
          : `Failed to synchronize ${service.name} data. Please try again.`,
        isSuccess: success
      });
    } catch (error) {
      console.error('Error syncing service:', error);
      setErrorMessage(`Error synchronizing ${service.name} data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSyncResult(null);
      setSaveResult(null);
      setErrorMessage(null);

      const updatedServices = services.map(service => {
        const serviceTimeUnit = timeUnits[service.id] || {};
        return {
          ...service,
          config: {
            ...service.config,
            timeUnit: serviceTimeUnit.duration || TimeUnitType.MINUTES
          }
        };
      });

      const settings = convertStateToSettings(updatedServices);
      const success = await editGeneralServiceSetting(settings);

      if (success) {
        setSaveResult({
          message: strings.SettingsPanel.saveSuccess,
          isSuccess: true
        });
      } else {
        setErrorMessage(strings.SettingsPanel.saveError);
      }
    } catch (error) {
      setErrorMessage(strings.SettingsPanel.saveError);
    } finally {
      setIsLoading(false);
    }
  };

  const renderServiceConfig = (service: IServiceData) => {
    const serviceTimeUnit = timeUnits[service.id] || {};
    switch (service.id) {
      case 'apollo':
        return (
          <ApolloConfig
            service={service}
            timeUnit={serviceTimeUnit.duration || TimeUnitType.MINUTES}
            onConfigChange={(fieldName, value) => handleServiceConfigChange(service.id, fieldName, value)}
            onTimeUnitChange={(fieldName, unit) => handleTimeUnitChange(service.id, fieldName, unit)}
            onSync={() => handleSyncService(service.id)}
            theme={theme}
          />
        );
      case 'ortto':
        return (
          <OrttoConfig
            service={service}
            timeUnit={serviceTimeUnit.duration || TimeUnitType.MINUTES}
            onConfigChange={(fieldName, value) => handleServiceConfigChange(service.id, fieldName, value)}
            onTimeUnitChange={(fieldName, unit) => handleTimeUnitChange(service.id, fieldName, unit)}
            onSync={() => handleSyncService(service.id)}
            theme={theme}
          />
        );
      case 'freshdesk':
        return (
          <FreshdeskConfig
            service={service}
            timeUnit={serviceTimeUnit.duration || TimeUnitType.MINUTES}
            timeoutUnit={serviceTimeUnit.timeout || TimeUnitType.MINUTES}
            onConfigChange={(fieldName, value) => handleServiceConfigChange(service.id, fieldName, value)}
            onTimeUnitChange={(fieldName, unit) => handleTimeUnitChange(service.id, fieldName, unit)}
            onSync={() => handleSyncService(service.id)}
            theme={theme}
          />
        );
      case 'pipedrive':
        return (
          <PipedriveConfig
            service={service}
            timeUnit={serviceTimeUnit.duration || TimeUnitType.MINUTES}
            onConfigChange={(fieldName, value) => handleServiceConfigChange(service.id, fieldName, value)}
            onTimeUnitChange={(fieldName, unit) => handleTimeUnitChange(service.id, fieldName, unit)}
            onSync={() => handleSyncService(service.id)}
            theme={theme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.largeFixed}
      isLightDismiss={true}
      headerText={strings.UserOptions.settings}
      styles={styleNames.panel}
      onRenderFooterContent={() => (
        <Stack horizontal horizontalAlign="space-between" style={{ width: '100%' }}>
          <PrimaryButton onClick={handleSave} disabled={isLoading}>
            {strings.SettingsPanel.save}
          </PrimaryButton>
          <DefaultButton onClick={onDismiss}>
            {strings.SettingsPanel.cancel}
          </DefaultButton>
        </Stack>
      )}
      isFooterAtBottom={true}
    >
      {syncResult && (
        <MessageBar
          messageBarType={syncResult.isSuccess ? MessageBarType.success : MessageBarType.error}
          isMultiline={false}
          onDismiss={() => setSyncResult(null)}
          dismissButtonAriaLabel="Close"
          styles={{ root: { marginBottom: 16 } }}
        >
          {syncResult.message}
        </MessageBar>
      )}

      {saveResult && (
        <MessageBar
          messageBarType={saveResult.isSuccess ? MessageBarType.success : MessageBarType.error}
          isMultiline={false}
          onDismiss={() => setSaveResult(null)}
          dismissButtonAriaLabel="Close"
          styles={{ root: { marginBottom: 16 } }}
        >
          {saveResult.message}
        </MessageBar>
      )}

      {errorMessage && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          onDismiss={() => setErrorMessage(null)}
          dismissButtonAriaLabel="Close"
          styles={{ root: { marginBottom: 16 } }}
        >
          {errorMessage}
        </MessageBar>
      )}

      {isLoading && services.length === 0 ? (
        <Stack className={classNames.loadingContainer} horizontalAlign="center" verticalAlign="center" style={{ height: '400px' }}>
          <Spinner size={SpinnerSize.large} label={strings.SettingsPanel.loading} />
        </Stack>
      ) : (
        <Pivot
            selectedKey={selectedTab}
            styles={styleNames.pivot}
            onLinkClick={(item) => handleServiceChange(item?.props.itemKey || '')}
          >
          {services.map(service => (
          <PivotItem 
            key={service.id}
            headerText={service.name} 
            itemKey={service.id}
          >
            {isLoading ? (
              <Stack className={classNames.loadingContainer}>
                <Spinner size={SpinnerSize.large} label={strings.SettingsPanel.loading} />
              </Stack>
            ) : (
              <div className={classNames.pivotContent}>

                <Stack className={classNames.section}>
                  <Label className={classNames.sectionTitle}>{strings.SettingsPanel.databaseTitle}</Label>
                  <SchemaEditor theme={theme} selectedService={service.id} />
                </Stack>

                <Separator />

                <Stack className={classNames.section}>
                  <Label className={classNames.sectionTitle}>{strings.SettingsPanel.serviceConfig}</Label>
                  {renderServiceConfig(service)}
                </Stack>
              </div>
            )}
          </PivotItem>
        ))}
        <PivotItem 
          key="add-service"
          headerText="+ Add Service" 
          itemKey="add-service"
        >
          <div className={classNames.pivotContent}>
            <Stack className={classNames.section} horizontalAlign="center" verticalAlign="center" style={{ height: '200px' }}>
              <Label>{strings.SettingsPanel.selectServiceConfig}</Label>
            </Stack>
          </div>
        </PivotItem>
      </Pivot>
      )}
    </Panel>
  );
};

export const SettingPanel = styled<ISettingPanelProps, ISettingPanelStyleProps, ISettingPanelStyles>(
  SettingPanelBase,
  getStyles,
  undefined,
  { scope: 'SettingsPanel' }
);