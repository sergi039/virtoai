import { Stack, TextField, IconButton, ThemeProvider, styled } from '@fluentui/react';
import { decryptAES, encryptAES } from '../../../utils/aes';
import type { ISecretsSettingsFormProps, ISecretsSettingsFormStyleProps, ISecretsSettingsFormStyles } from './SecretsSettingsForm.types';
import { getStyles } from './SecretsSettingsForm.styles';
import { useState } from 'react';

const SecretsSettingsFormBase: React.FC<ISecretsSettingsFormProps> = ({
  apiKey,
  apiUrl,
  onApiKeyChange,
  onApiUrlChange,
  theme: customTheme,
}) => {
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showApiUrl, setShowApiUrl] = useState<boolean>(false);

  const theme = customTheme || {};
  const styleProps: ISecretsSettingsFormStyleProps = { theme: theme as any };
  const styles = getStyles(styleProps);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        tokens={{ childrenGap: 8 }}
        styles={{
          root: styles.rootStack,
        }}
      >
        <Stack tokens={{ childrenGap: 8 }} 
          styles={{
            root: styles.formStack,
          }
          }>
          <Stack horizontal tokens={{ childrenGap: 0 }} styles={{ root: styles.fieldContainer }}>
            <TextField
              type={showApiKey ? 'text' : 'password'}
              label="ApiKey"
              value={decryptAES(apiKey)}
              onChange={(_, v) => onApiKeyChange(v?encryptAES(v):null)}
              autoComplete="off"
              styles={styles.textField}
            />
            <IconButton
              iconProps={{ iconName: showApiKey ? 'Hide' : 'RedEye' }}
              title={showApiKey ? 'Hide' : 'Show'}
              ariaLabel={showApiKey ? 'Hide' : 'Show'}
              onClick={() => setShowApiKey((v) => !v)}
              styles={styles.iconButton}
            />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 0 }} styles={{ root: styles.fieldContainer }}>
            <TextField
              type={showApiUrl ? 'text' : 'password'}
              label="ApiUrl"
              value={decryptAES(apiUrl)}
              onChange={(_, v) => onApiUrlChange(v?encryptAES(v):null)}
              autoComplete="off"
              styles={styles.textField}
            />
            <IconButton
              iconProps={{ iconName: showApiUrl ? 'Hide' : 'RedEye' }}
              title={showApiUrl ? 'Hide' : 'Show'}
              ariaLabel={showApiUrl ? 'Hide' : 'Show'}
              onClick={() => setShowApiUrl((v) => !v)}
              styles={styles.iconButton}
            />
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export const SecretsSettingsForm = styled<ISecretsSettingsFormProps, ISecretsSettingsFormStyleProps, ISecretsSettingsFormStyles>(
  SecretsSettingsFormBase,
  getStyles,
  undefined,
  { scope: 'SecretsSettingsForm' }
);