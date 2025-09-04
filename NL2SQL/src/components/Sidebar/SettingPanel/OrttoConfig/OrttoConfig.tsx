import { Stack, TextField, styled } from '@fluentui/react';
import { IOrttoConfigProps, IOrttoConfigStyleProps, IOrttoConfigStyles } from './OrttoConfig.types';
import { getClassNames, getStyles } from './OrttoConfig.styles';
import strings from '../../../../Ioc/en-us';
import { SyncTimeInput } from '../SyncTimeInput';
import { ToggleRow } from '../ToggleRow';
import { SyncButton } from '../SyncButton';
import { SecretsSettingsForm } from '../SecretsSettingsForm';

const OrttoConfigBase: React.FC<IOrttoConfigProps> = ({
  service,
  timeUnit,
  onConfigChange,
  onTimeUnitChange,
  onSync,
  theme,
  styles
}) => {
  const classNames = getClassNames(styles, { theme });

  const firstRowToggles = [
    {
      label: strings.SettingsPanel.ortto.setup,
      checked: !!service.config.setup,
      onChange: (checked: boolean) => onConfigChange('setup', checked)
    },
    {
      label: strings.SettingsPanel.ortto.importData,
      checked: !!service.config.importData,
      onChange: (checked: boolean) => onConfigChange('importData', checked)
    },
  ];

  const secondRowToggles = [
    {
      label: strings.SettingsPanel.ortto.matchFreshdesk,
      checked: !!service.config.matchFreshdesk,
      onChange: (checked: boolean) => onConfigChange('matchFreshdesk', checked)
    },
    {
      label: strings.SettingsPanel.ortto.matchPipedrive,
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
          {(service.config.limit !== undefined && service.config.limit !== null) && (
            <TextField
              label={strings.SettingsPanel.ortto.limit}
              type="number"
              value={service.config.limit.toString()}
              onChange={(_, value) => {
                const numValue = value ? parseInt(value) : 0;
                onConfigChange('limit', numValue);
              }}
            />
          )}
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
        toggles={firstRowToggles}
        theme={theme}
      />

      <ToggleRow
        toggles={secondRowToggles}
        theme={theme}
      />

      <SyncButton
        text={strings.SettingsPanel.ortto.syncButton || "Sync"}
        onClick={onSync}
        theme={theme}
      />
    </Stack>
  );
};

export const OrttoConfig = styled<
  IOrttoConfigProps,
  IOrttoConfigStyleProps,
  IOrttoConfigStyles
>(OrttoConfigBase, getStyles);