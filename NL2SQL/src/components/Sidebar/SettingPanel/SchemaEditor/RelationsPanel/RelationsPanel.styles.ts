import { IRelationsPanelStyleProps, IRelationsPanelStyles } from './RelationsPanel.types';
import { classNamesFunction, mergeStyleSets } from '@fluentui/react';

export const getStyles = (props: IRelationsPanelStyleProps): IRelationsPanelStyles => {
  const { theme } = props;

  return mergeStyleSets({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.white,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '20px 20px 0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    section: {
      backgroundColor: theme.palette.white,
      padding: '16px',
      borderRadius: '4px',
    },
    sectionTitle: {
      fontWeight: '600',
      marginBottom: '16px',
      color: theme.palette.neutralPrimary,
      fontSize: '16px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    dropdown: {
      marginBottom: '0px',
    },
    relationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      backgroundColor: theme.palette.neutralLighterAlt,
      borderRadius: '4px',
      marginBottom: '8px',
      border: `1px solid ${theme.palette.neutralTertiary}`,
    },
    relationInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    relationActions: {
      display: 'flex',
      gap: '8px',
    },
    footer: {
      padding: '16px 20px',
      borderTop: `1px solid ${theme.palette.neutralTertiaryAlt}`,
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.white,
      minHeight: '70px',
      alignItems: 'center',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
};

export const getClassNames = classNamesFunction<IRelationsPanelStyleProps, IRelationsPanelStyles>();
