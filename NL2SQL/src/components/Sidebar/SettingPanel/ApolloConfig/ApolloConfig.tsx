import { Stack, TextField, styled } from '@fluentui/react';
import { IApolloConfigProps, IApolloConfigStyleProps, IApolloConfigStyles } from './ApolloConfig.types';
import { getClassNames, getStyles } from './ApolloConfig.styles';
import strings from '../../../../Ioc/en-us';
import { SyncTimeInput } from '../SyncTimeInput';
import { ToggleRow } from '../ToggleRow';
import { SyncButton } from '../SyncButton';
import SecretsSettingsForm from '../../../SecretsSettingsForm';

const ApolloConfigBase: React.FC<IApolloConfigProps> = ({
  service,
  timeUnit,
  onConfigChange,
  onTimeUnitChange,
  onSync,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme });

  const toggleConfigs = [
    {
      label: strings.SettingsPanel.apollo.setup,
      checked: !!service.config.setup,
      onChange: (checked: boolean) => onConfigChange('setup', checked)
    },
    {
      label: strings.SettingsPanel.apollo.matchFreshdesk,
      checked: !!service.config.matchFreshdesk,
      onChange: (checked: boolean) => onConfigChange('matchFreshdesk', checked)
    },
    {
      label: strings.SettingsPanel.apollo.matchPipedrive,
      checked: !!service.config.matchPipedrive,
      onChange: (checked: boolean) => onConfigChange('matchPipedrive', checked)
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
            label={strings.SettingsPanel.apollo.limit}
            type="number"
            value={((service.config.limit !== undefined && service.config.limit !== null) ? service.config.limit : 10).toString()}
            onChange={(_, value) => {
              const numValue = value ? parseInt(value) : 10;
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
        <TextField
          label={strings.SettingsPanel.apollo.domain}
          value={service.config.domain || ''}
          onChange={(_, value) => onConfigChange('domain', value || '')}
        />
      </Stack>
      <Stack className={classNames.formGroup}>
        <TextField
          label={strings.SettingsPanel.apollo.emailDomain}
          value={service.config.emailDomain || ''}
          onChange={(_, value) => onConfigChange('emailDomain', value || '')}
        />
      </Stack>
      <Stack className={classNames.formGroup}>
        <TextField
          label={strings.SettingsPanel.apollo.name}
          value={service.config.name || ''}
          onChange={(_, value) => onConfigChange('name', value || '')}
        />
      </Stack>

      <SyncButton
        text={strings.SettingsPanel.apollo.syncButton || "Sync"}
        onClick={onSync}
        theme={theme}
      />
    </Stack>
  );
};

export const ApolloConfig = styled<
  IApolloConfigProps,
  IApolloConfigStyleProps,
  IApolloConfigStyles
>(ApolloConfigBase, getStyles);