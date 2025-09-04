import { Stack, TextField, Label, Checkbox, styled } from '@fluentui/react';
import { IPipedriveConfigProps, IPipedriveConfigStyleProps, IPipedriveConfigStyles } from './PipedriveConfig.types';
import { getClassNames, getStyles } from './PipedriveConfig.styles';
import strings from '../../../../Ioc/en-us';
import { SyncTimeInput } from '../SyncTimeInput';
import { ToggleRow } from '../ToggleRow';
import { SyncButton } from '../SyncButton';
import { SecretsSettingsForm } from '../../SecretsSettingsForm';

const PipedriveConfigBase: React.FC<IPipedriveConfigProps> = ({
  service,
  timeUnit,
  onConfigChange,
  onTimeUnitChange,
  onSync,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme });

  const pipedriveEntities = [
    'all', 'deals', 'activities', 'contacts', 'organizations',
  ];

  const pipedriveEntityNames = {
    all: strings.SettingsPanel.pipedrive.entitiesAll,
    deals: strings.SettingsPanel.pipedrive.entitiesDeals,
    activities: strings.SettingsPanel.pipedrive.entitiesActivities,
    contacts: strings.SettingsPanel.pipedrive.contacts,
    organizations: strings.SettingsPanel.pipedrive.entitiesOrganizations,
  };

  let entities = service.config.entities;
  if (typeof entities === 'string') {
    entities = entities.split(',');
  } else if (!Array.isArray(entities)) {
    entities = ['all'];
  }

  const toggleConfigs = [
    {
      label: strings.SettingsPanel.pipedrive.setup,
      checked: !!service.config.setup,
      onChange: (checked: boolean) => onConfigChange('setup', checked)
    },
    {
      label: strings.SettingsPanel.pipedrive.fullImport,
      checked: !!service.config.full,
      onChange: (checked: boolean) => onConfigChange('full', checked)
    },
    {
      label: strings.SettingsPanel.pipedrive.match,
      checked: !!service.config.match,
      onChange: (checked: boolean) => onConfigChange('match', checked)
    }
  ];

  const handleEntityChange = (entity: string, checked: boolean) => {
    let newEntities: string[];
    if (entity === 'all') {
      newEntities = checked ? ['all'] : entities.filter((e: string) => e !== 'all');
    } else {
      if (checked) {
        newEntities = [...entities.filter((e: string) => e !== 'all'), entity];
      } else {
        newEntities = entities.filter((e: string) => e !== entity);
      }
      if (newEntities.length === 0) {
        newEntities = ['all'];
      }
    }
    onConfigChange('entities', newEntities);
  };

  return (
    <Stack className={classNames.configBox}>
      <SecretsSettingsForm
        apiKey={service.config.apiKey || ''}
        apiUrl={service.config.apiUrl || ''}
        onApiKeyChange={(value) => onConfigChange('apiKey', value)}
        onApiUrlChange={(value) => onConfigChange('apiUrl', value)}
        theme={theme}
      />

      <Stack className={classNames.twoColumnContainer}>
        <Stack className={classNames.columnItem}>
          <TextField
            label={strings.SettingsPanel.apollo.limit || 'Limit'}
            type="number"
            value={((service.config.limit !== undefined && service.config.limit !== null) ? service.config.limit : 100).toString()}
            onChange={(_, value) => {
              const numValue = value ? parseInt(value) : 100;
              onConfigChange('limit', numValue);
            }}
          />
        </Stack>

        <Stack className={classNames.columnItem}>
          <SyncTimeInput
            value={(service.config.duration !== undefined && service.config.duration !== null) ? service.config.duration : 60}
            unit={timeUnit}
            onChange={(value) => onConfigChange('duration', value)}
            onUnitChange={(unit) => onTimeUnitChange('duration', unit)}
            theme={theme}
          />
        </Stack>
      </Stack>

      <ToggleRow 
        toggles={toggleConfigs}
        theme={theme}
      />

      <Stack className={classNames.formGroup}>
        <Label>{strings.SettingsPanel.pipedrive.entities}</Label>

        <Stack className={classNames.toggleRow}>
          {pipedriveEntities.slice(0, 3).map(entity => (
            <Checkbox
              key={entity}
              label={pipedriveEntityNames[entity as keyof typeof pipedriveEntityNames]}
              checked={entities.includes(entity)}
              className={classNames.columnItem}
              onChange={(_, checked) => handleEntityChange(entity, !!checked)}
            />
          ))}
        </Stack>

        <Stack className={classNames.toggleRow}>
          {pipedriveEntities.slice(3, 6).map(entity => (
            <Checkbox
              key={entity}
              label={pipedriveEntityNames[entity as keyof typeof pipedriveEntityNames]}
              checked={entities.includes(entity)}
              className={classNames.columnItem}
              onChange={(_, checked) => handleEntityChange(entity, !!checked)}
            />
          ))}
        </Stack>

        <Stack className={classNames.toggleRow}>
          {pipedriveEntities.slice(6).map(entity => (
            <Checkbox
              key={entity}
              label={pipedriveEntityNames[entity as keyof typeof pipedriveEntityNames]}
              checked={entities.includes(entity)}
              className={classNames.columnItem}
              onChange={(_, checked) => handleEntityChange(entity, !!checked)}
            />
          ))}
        </Stack>
      </Stack>

      <SyncButton
        text={strings.SettingsPanel.pipedrive.syncButton || "Sync"}
        onClick={onSync}
        theme={theme}
      />
    </Stack>
  );
};

export const PipedriveConfig = styled<
  IPipedriveConfigProps,
  IPipedriveConfigStyleProps,
  IPipedriveConfigStyles
>(PipedriveConfigBase, getStyles);