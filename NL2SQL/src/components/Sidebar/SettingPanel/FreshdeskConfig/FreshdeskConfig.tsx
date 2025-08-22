import { Stack, TextField, Label, ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles, DatePicker, styled } from '@fluentui/react';
import { IFreshdeskConfigProps, IFreshdeskConfigStyleProps, IFreshdeskConfigStyles } from './FreshdeskConfig.types';
import { getClassNames, getStyles } from './FreshdeskConfig.styles';
import strings from '../../../../Ioc/en-us';
import { SyncTimeInput } from '../SyncTimeInput';
import { ToggleRow } from '../ToggleRow';
import { SyncButton } from '../SyncButton';
import SecretsSettingsForm from '../../../SecretsSettingsForm';

const FreshdeskConfigBase: React.FC<IFreshdeskConfigProps> = ({
  service,
  timeUnit,
  timeoutUnit,
  onConfigChange,
  onTimeUnitChange,
  onSync,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme });

  const entitiesOptions: IChoiceGroupOption[] = [
    { key: 'all', text: strings.SettingsPanel.freshdesk.allEntities },
    { key: 'tickets', text: strings.SettingsPanel.freshdesk.ticketsOnly },
    { key: 'contacts', text: strings.SettingsPanel.freshdesk.contactsOnly },
    { key: 'companies', text: strings.SettingsPanel.freshdesk.companiesOnly }
  ];

  const choiceGroupStyles: IChoiceGroupStyles = {
    root: { marginBottom: '16px' }
  };

  const toggleConfigs = [
    {
      label: strings.SettingsPanel.freshdesk.conversations,
      checked: !!service.config.conversations,
      onChange: (checked: boolean) => onConfigChange('conversations', checked)
    },
    {
      label: strings.SettingsPanel.freshdesk.insecure,
      checked: !!service.config.insecure,
      onChange: (checked: boolean) => onConfigChange('insecure', checked)
    }
  ];

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
            label={strings.SettingsPanel.freshdesk.batchSize}
            type="number"
            value={((service.config.batchSize !== undefined && service.config.batchSize !== null) ? service.config.batchSize : 100).toString()}
            onChange={(_, value) => {
              const numValue = value ? parseInt(value) : 100;
              onConfigChange('batchSize', numValue);
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

      <Stack className={classNames.formGroup}>
        <ChoiceGroup
          label={strings.SettingsPanel.freshdesk.entities}
          selectedKey={service.config.entities || 'all'}
          options={entitiesOptions}
          onChange={(_, option) => option && onConfigChange('entities', option.key)}
          styles={choiceGroupStyles}
        />
      </Stack>

      <ToggleRow
        toggles={toggleConfigs}
        theme={theme}
      />

      <Stack horizontal tokens={{ childrenGap: 10 }} className={classNames.formGroup}>
        <Stack.Item grow={1}>
          <DatePicker
            label={strings.SettingsPanel.freshdesk.sinceDate}
            placeholder={strings.SettingsPanel.freshdesk.selectDate}
            value={service.config.since ? new Date(service.config.since) : undefined}
            onSelectDate={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onConfigChange('since', `${year}-${month}-${day}`);
              } else {
                onConfigChange('since', '');
              }
            }}
          />
        </Stack.Item>
        <Stack.Item grow={1}>
          <DatePicker
            label={strings.SettingsPanel.freshdesk.untilDate}
            placeholder={strings.SettingsPanel.freshdesk.selectDate}
            value={service.config.until ? new Date(service.config.until) : undefined}
            onSelectDate={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onConfigChange('until', `${year}-${month}-${day}`);
              } else {
                onConfigChange('until', '');
              }
            }}
          />
        </Stack.Item>
      </Stack>

      <Stack className={classNames.twoColumnContainer}>
        <Stack.Item className={classNames.columnItem}>
          <Label>{strings.SettingsPanel.freshdesk.parallelThreads}</Label>
          <Stack horizontal className={classNames.formGroup}>
            <TextField
              type="number"
              value={((service.config.parallelThreads !== undefined && service.config.parallelThreads !== null) ? service.config.parallelThreads : 5).toString()}
              onChange={(_, value) => {
                const numValue = value ? parseInt(value) : 5;
                onConfigChange('parallelThreads', numValue);
              }}
              styles={{ root: { width: '100%' } }}
            />
          </Stack>
        </Stack.Item>

        <Stack.Item className={classNames.columnItem}>
          <SyncTimeInput
            label={strings.SettingsPanel.freshdesk.timeout || 'Timeout'}
            value={(service.config.timeout !== undefined && service.config.timeout !== null) ? service.config.timeout : 30}
            unit={timeoutUnit}
            onChange={(value) => onConfigChange('timeout', value)}
            onUnitChange={(unit) => onTimeUnitChange('timeout', unit)}
            theme={theme}
          />
        </Stack.Item>
      </Stack>

      <Stack className={classNames.formGroup}>
        <TextField
          label={strings.SettingsPanel.freshdesk.ticketId}
          type="number"
          value={((service.config.ticketId !== undefined && service.config.ticketId !== null) ? service.config.ticketId : '').toString()}
          onChange={(_, value) => {
            const numValue = value ? parseInt(value) : 0;
            onConfigChange('ticketId', numValue);
          }}
        />
      </Stack>

      <SyncButton
        text={strings.SettingsPanel.freshdesk.syncButton || "Sync"}
        onClick={onSync}
        theme={theme}
      />
    </Stack>
  );
};

export const FreshdeskConfig = styled<
  IFreshdeskConfigProps,
  IFreshdeskConfigStyleProps,
  IFreshdeskConfigStyles
>(FreshdeskConfigBase, getStyles);