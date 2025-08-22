import { createTheme, ITheme } from "@fluentui/react";

export const lightTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#6264a7', 
    themeLighter: '#5c5ea3',
    themeSecondary: '#444654',
    themeTertiary: '#2b2c2e',
    themeDark: '#202123',
    themeDarker: '#343541',
    neutralPrimary: '#333333',
    neutralQuaternary: '#4d4d4f',
    neutralSecondary: '#666666',
    neutralTertiary: '#999999',
    neutralLight: '#f8f9fa',
    neutralLighter: '#ececf1',
    accent: '#6264a7', 
    white: '#ffffff',
    black: '#000000',
  },
  components: {
    PrimaryButton: {
      styles: {
        rootHovered: {
          backgroundColor: '#5c5ea3', 
          border: '1px solid #6264a7', 
        },
      },
    },
  },
});