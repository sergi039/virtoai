import React from 'react'
import ReactDOM from 'react-dom'
import { MsalProvider } from '@azure/msal-react';
import { App } from './components/App';
import { msalInstance } from './config/authConfig';


const initializeApp = async () => {
  try {
    await msalInstance.initialize();
    
    ReactDOM.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>,
      document.getElementById('root')
    );
  } catch (error) {
    console.error('Failed to initialize MSAL:', error);
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; margin-top: 50px;"><h2>Authentication initialization failed</h2><p>Please refresh the page</p></div>';
    }
  }
};

initializeApp();
