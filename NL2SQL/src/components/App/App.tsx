import { Stack, ThemeProvider, Spinner, SpinnerSize } from '@fluentui/react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { AutoSignIn } from '../Auth';
import type { IAppStyleProps } from './App.types';
import { getStyles, getClassNames } from './App.styles';
import { useNL2SQLStore } from '../../stores/useNL2SQLStore';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from '../Layout';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useMsal } from '@azure/msal-react';
import strings from '../../Ioc/en-us';

initializeIcons();

export const App = () => {
  const { initializeStore, currentTheme, isInitializeStore } = useNL2SQLStore();
  const { instance, accounts, inProgress } = useMsal();
  
  const styleProps: IAppStyleProps = {
    theme: currentTheme,
  };

  useEffect(() => {
    const handleRedirectPromise = async () => {
      try {
        await instance.handleRedirectPromise();
      } catch (error) {
        console.error('Error handling redirect promise:', error);
      }
    };

    handleRedirectPromise();
  }, [instance]);

  useEffect(() => {
    if (inProgress === 'none') {
      initializeStore(accounts, instance);
    }
  }, [accounts, instance, initializeStore, inProgress]);

  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);

  return (
    <ThemeProvider theme={currentTheme}>
      <Stack className={classNames.root}>
        {!isInitializeStore || inProgress !== 'none' ? (
          <Stack horizontalAlign="center" verticalAlign="center" styles={styleNames.containerLoading}>
            <Spinner size={SpinnerSize.large} label={strings.loading} />
          </Stack>
        ) : (
          <>
            <AuthenticatedTemplate>
              <Router>
                <MainLayout />
              </Router>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
              <AutoSignIn />
            </UnauthenticatedTemplate>
          </>
        )}
      </Stack>

      <Toaster position="top-right" />
    </ThemeProvider>
  );
};