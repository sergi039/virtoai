import { classNamesFunction } from '@fluentui/react';
import { ISettingPanelStyleProps, ISettingPanelStyles } from './SettingPanel.types';

export const getStyles = (props: ISettingPanelStyleProps): ISettingPanelStyles => {
  const { theme } = props;

  return {
    panel: {
      main: {
        backgroundColor: theme?.palette.white,
        border: 'none',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.14)',
      },
      header: {
        backgroundColor: theme?.palette.white,
        color: theme?.palette.neutralPrimary,
        padding: '16px',
      },
      content: {
        backgroundColor: theme?.palette.white,
        color: theme?.palette.neutralPrimary,
        padding: '0 20px',
      },
      footer: {
        backgroundColor: theme?.palette.white,
        padding: '16px',
      },
    },
    panelContent: {
      padding: '0 20px 20px 0',
      color: theme?.palette.neutralPrimary,
    },
    sectionTitle: {
      fontSize: '16px',
      marginLeft: '7px',
      fontWeight: 600,
    },
    addServiceOption: {
      color: theme?.palette.themePrimary,
      fontWeight: '400',
    },
    addServiceTab: {
      color: theme?.palette.themePrimary,
      borderColor: theme?.palette.themePrimary,
      backgroundColor: 'transparent',
      selectors: {
        '&:hover': {
          backgroundColor: theme?.palette.themeLight,
        }
      }
    },
    section: {
      marginBottom: '16px',
    },
    serviceSelection: {
      marginBottom: '12px',
    },
    tableSelection: {
      marginTop: '12px',
    },
    serviceConfig: {
      marginTop: '12px',
    },
    formGroup: {
      marginBottom: '12px',
    },
    formField: {
      marginBottom: '8px',
    },
    pivot: {
      root: {
        paddingLeft: '0',
        marginLeft: '0',
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        paddingBottom: '15px',
      },
      link: {
        paddingLeft: '8px',
        paddingRight: '8px',
        minWidth: '100px',
        justifyContent: 'flex-start',
        textAlign: 'center',
      },
      linkIsSelected: {
        paddingLeft: '8px',
        paddingRight: '8px',
        minWidth: '100px',
        justifyContent: 'flex-start',
        textAlign: 'center',
      },
      linkContent: {
        justifyContent: 'center',
      },
    },
    pivotContent: {
      paddingLeft: '0',
      marginLeft: '0',
    },
    separator: {
      height: '1px',
      backgroundColor: theme?.palette.neutralLight,
      border: 'none',
      width: '100%'
    },
    compactSeparator: {
      height: '1px',
      backgroundColor: theme?.palette.neutralLight,
      border: 'none',
      width: '100%'
    },
    messageBar: {
      marginBottom: '16px'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 0',
      minHeight: '200px',
    },
    toggleRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '16px',
      '& > *': {
        minWidth: 0
      }
    },
    toggleItem: {
      margin: 0,
      width: '100%',
      '& .ms-Toggle': {
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center'
      }
    },
    timeFieldGroup: {
      width: '100%'
    },
    unitDropdown: {
      width: '100%',
      marginLeft: 8
    },
    syncButton: {
      marginTop: '16px',
      width: 'auto',
      padding: '0 16px',
      height: '32px',
      minWidth: '120px',
      fontSize: '14px',
      fontWeight: '400',
      backgroundColor: theme?.palette.themePrimary,
      color: theme?.palette.white,
      border: 'none',
      borderRadius: '2px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      selectors: {
        '&:hover': {
          backgroundColor: theme?.palette.themeLighter
        }
      }
    },
    configBox: {
      border: '1px solid #edebe9',
      borderRadius: '2px',
      padding: '16px',
      marginTop: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0px 1.2px 3.6px rgba(0, 0, 0, 0.03)'
    },
    timeValueContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    twoColumnContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
    },
    columnItem: {
      width: '100%',
    },
    syncButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px'
    }
  };
};

export const getClassNames = classNamesFunction<ISettingPanelStyleProps, ISettingPanelStyles>();