import * as React from 'react';
import { Stack, TextField, IconButton, ThemeProvider } from '@fluentui/react';
import { decryptAES, encryptAES } from '../utils/aes';

interface SecretsSettingsFormProps {
  apiKey: string;
  apiUrl: string;
  onApiKeyChange: (value: string | null) => void;
  onApiUrlChange: (value: string | null) => void;
  theme?: any;
}

const SecretsSettingsForm: React.FC<SecretsSettingsFormProps> = ({
  apiKey,
  apiUrl,
  onApiKeyChange,
  onApiUrlChange,
  theme,
}) => {
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [showApiUrl, setShowApiUrl] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        tokens={{ childrenGap: 8 }}
        styles={{
          root: {
            width: '100%',
            padding: 0,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          },
        }}
      >
        <h2 style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Secrets Settings</h2>
        <Stack tokens={{ childrenGap: 8 }} 
          styles={{
            root: {
              width: '100%',
              borderRadius: 4,
            }
          }
          }>
          <Stack horizontal tokens={{ childrenGap: 0 }} styles={{ root: { width: '100%' } }}>
            <TextField
              type={showApiKey ? 'text' : 'password'}
              label="ApiKey"
              value={decryptAES(apiKey)}
              onChange={(_, v) => onApiKeyChange(v?encryptAES(v):null)}
              autoComplete="off"
              styles={{
                root: { flex: 1 },
                field: {
                  height: 32,
                  fontSize: 14,
                  padding: '4px 8px',
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              iconProps={{ iconName: showApiKey ? 'Hide' : 'RedEye' }}
              title={showApiKey ? 'Hide' : 'Show'}
              ariaLabel={showApiKey ? 'Hide' : 'Show'}
              onClick={() => setShowApiKey((v) => !v)}
              styles={{
                root: {
                  marginTop: 22,
                  marginLeft: 4,
                  height: 28,
                  width: 28,
                  alignSelf: 'flex-end',
                },
              }}
            />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 0 }} styles={{ root: { width: '100%' } }}>
            <TextField
              type={showApiUrl ? 'text' : 'password'}
              label="ApiUrl"
              value={decryptAES(apiUrl)}
              onChange={(_, v) => onApiUrlChange(v?encryptAES(v):null)}
              autoComplete="off"
              styles={{
                root: { flex: 1 },
                field: {
                  height: 32,
                  fontSize: 14,
                  padding: '4px 8px',
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              iconProps={{ iconName: showApiUrl ? 'Hide' : 'RedEye' }}
              title={showApiUrl ? 'Hide' : 'Show'}
              ariaLabel={showApiUrl ? 'Hide' : 'Show'}
              onClick={() => setShowApiUrl((v) => !v)}
              styles={{
                root: {
                  marginTop: 22,
                  marginLeft: 4,
                  height: 28,
                  width: 28,
                  alignSelf: 'flex-end',
                },
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default SecretsSettingsForm;