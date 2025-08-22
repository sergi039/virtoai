import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
    },
};

export const loginRequest = {
    scopes: [import.meta.env.VITE_AZURE_API_SCOPE],
    redirectUri: window.location.origin,
};

export const graphRequest = {
    scopes: ['User.Read', 'User.ReadBasic.All'], 
};

export const msalInstance = new PublicClientApplication(msalConfig);