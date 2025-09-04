import { classNamesFunction } from '@fluentui/react';
import type { IInfoPanelStyleProps, IInfoPanelStyles } from './InfoPanel.types';
import { animateSyncStyles } from '../../../api/constants/animateSyncStyles';

export const getStyles = (props: IInfoPanelStyleProps): IInfoPanelStyles => {
  const { theme } = props;

  if (typeof document !== 'undefined' && !document.getElementById('info-panel-spin')) {
    const style = document.createElement('style');
    style.id = 'info-panel-spin';
    style.textContent = animateSyncStyles;
    document.head.appendChild(style);
  }

  return {
    root: {
      position: 'sticky',
      top: 0,
      width: '100%',
      zIndex: 1000,
      backgroundColor: theme?.palette.white || '#ffffff',
      border: `1px solid ${theme?.palette.neutralLight || '#e1e1e1'}`,
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    panelContainer: {
      width: '100%',
      backgroundColor: 'transparent',
    },
    panelContent: {
      padding: '6px 16px',
      color: theme?.palette.neutralPrimary || '#323130',
    },
    servicesGrid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      flexWrap: 'wrap',
    },
    serviceCard: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '6px 10px',
      backgroundColor: theme?.palette.neutralLighterAlt || '#faf9f8',
      borderRadius: '6px',
      border: `1px solid ${theme?.palette.neutralLight || '#e1e1e1'}`,
      transition: 'all 0.2s ease-in-out',
      minWidth: '170px',
      maxWidth: '210px',
      ':hover': {
        backgroundColor: theme?.palette.neutralLighter || '#f3f2f1',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        transform: 'translateY(-1px)',
      }
    },
    serviceIcon: {
      width: '18px',
      height: '18px',
      marginRight: '8px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    serviceInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    serviceName: {
      fontWeight: '600',
      fontSize: '12px',
      color: theme?.palette.neutralPrimary || '#323130',
      lineHeight: '1.1',
    },
    serviceDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1px',
    },
    syncTime: {
      fontSize: '11px',
      color: theme?.palette.neutralSecondary || '#605e5c',
      lineHeight: '1.1',
    },
    recordCount: {
      fontSize: '11px',
      color: theme?.palette.neutralTertiary || '#a19f9d',
      lineHeight: '1.1',
      fontWeight: '500',
    },
    icon: {
      display: 'none',
    },
    recordCounts: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    totalRecordCount: {
      fontSize: '11px',
      color: theme?.palette.neutralPrimary || '#323130',
      lineHeight: '1.1',
      fontWeight: '400',
    },
    syncButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: theme?.palette.neutralSecondary || '#605e5c',
      ':hover': {
        backgroundColor: 'transparent',
        color: theme?.palette.themePrimary || '#6264a7',
        transform: 'scale(1.05)',
      },
      ':disabled': {
        cursor: 'not-allowed',
        opacity: 0.6,
        ':hover': {
          backgroundColor: 'transparent',
          color: theme?.palette.neutralSecondary || '#605e5c',
          transform: 'none',
        }
      }
    },
    syncButtonIcon: {
      display: 'inline-block',
      transformOrigin: '50% 50%',
    },
    spinning: {
      animation: 'spin 4s linear infinite',
    }
  };
};

export const getClassNames = classNamesFunction<IInfoPanelStyleProps, IInfoPanelStyles>();
