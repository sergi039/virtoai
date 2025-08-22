import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/authConfig';
import { Stack, Spinner, SpinnerSize } from '@fluentui/react';

export const AutoSignIn: React.FC = () => {
  const { instance } = useMsal();

  useEffect(() => {
    const startLogin = async () => {
      try {
        await instance.loginRedirect({
          ...loginRequest,
          prompt: 'select_account'
        });
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    startLogin();
  }, [instance]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100vh' } }}>
      <Spinner 
        size={SpinnerSize.large} 
        label="Redirecting to Microsoft Login..."
      />
    </Stack>
  );
};