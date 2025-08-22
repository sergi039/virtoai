import { classNamesFunction } from '@fluentui/react';
import { ITablesSectionStyleProps, ITablesSectionStyles } from './TablesSection.types';

export const getStyles = (props: ITablesSectionStyleProps): ITablesSectionStyles => {
  const { theme } = props;

  return {
    root: {
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: theme?.palette.neutralPrimary,
    },
    commandBar: {
      root: {
        backgroundColor: theme?.palette.neutralLighter,
        border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
        borderRadius: '4px',
        marginBottom: '8px',
      },
    },
    tablesList: {
      root: {
        minHeight: '200px',
        border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
        borderRadius: '4px',
        backgroundColor: theme?.palette.white,
        cursor: 'pointer',
      },
      headerWrapper: {
        backgroundColor: theme?.palette.neutralLighterAlt,
      },
    },
    relationsList: {
      root: {
        minHeight: '100px',
        border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
        borderRadius: '4px',
        backgroundColor: theme?.palette.white,
      },
      headerWrapper: {
        backgroundColor: theme?.palette.neutralLighterAlt,
      },
    },
    loadingContainer: {
      padding: '20px',
      textAlign: 'center',
    },
    noRelationsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      color: theme?.palette.neutralSecondary,
    },
    noRelationsIcon: {
      fontSize: '12px',
      color: theme?.palette.neutralTertiary,
    },
    noRelationsText: {
      fontStyle: 'italic',
    },
    relationsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      fontSize: '11px',
    },
    relationItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    relationIcon: {
      fontSize: '12px',
      minWidth: '12px',
    },
    relationTableName: {
      fontWeight: '500',
      color: theme?.palette.neutralPrimary,
    },
    relationColumns: {
      color: theme?.palette.neutralSecondary,
      fontSize: '10px',
      flex: 1,
    },
  };
};

export const getClassNames = classNamesFunction<ITablesSectionStyleProps, ITablesSectionStyles>();
