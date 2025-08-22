import { classNamesFunction } from '@fluentui/react';
import type { IExpandedTableViewStyleProps, IExpandedTableViewStyles } from './ExpandedTableView.types';

export const getStyles = (props: IExpandedTableViewStyleProps): IExpandedTableViewStyles => {
  const { theme } = props;

  return {
    panel: {
      main: {
        backgroundColor: theme?.palette.white,
        height: '100vh',
      },
      content: {
        padding: '0',
      },
      headerText: {
        fontSize: '20px',
        fontWeight: 600,
        color: theme?.palette.neutralPrimary,
      },
      header: {
        padding: '20px 24px 16px',
        borderBottom: `1px solid ${theme?.palette.neutralLight}`,
      },
    },
    content: {
      padding: '20px 24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    tableContainer: {
      flex: 1,
      overflow: 'auto',
      border: `1px solid ${theme?.palette.neutralLight}`,
      borderRadius: '4px',
      backgroundColor: theme?.palette.white,
    },
    detailsList: {
      root: {
        selectors: {
          '.ms-DetailsHeader': {
            backgroundColor: theme?.palette.neutralLighterAlt,
            borderBottom: `2px solid ${theme?.palette.neutralLight}`,
          },
          '.ms-DetailsHeader-cell': {
            fontSize: '14px',
            fontWeight: 600,
            color: theme?.palette.neutralPrimary,
            ':hover': {
              backgroundColor: theme?.palette.neutralLighter,
            },
          },
          '.ms-DetailsRow': {
            ':hover': {
              backgroundColor: theme?.palette.neutralLighterAlt,
            },
          },
          '.ms-DetailsRow-cell': {
            fontSize: '13px',
            color: theme?.palette.neutralPrimary,
            padding: '12px 8px',
            borderBottom: `1px solid ${theme?.palette.neutralLighter}`,
          },
        },
      },
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      padding: '12px 0',
      borderTop: `1px solid ${theme?.palette.neutralLight}`,
    },
    pageInfo: {
      fontSize: '14px',
      color: theme?.palette.neutralSecondary,
    },
    redirectText: {
      cursor: 'pointer',
      color: theme?.palette.themeLighter,
      textDecoration: 'underline',
      wordBreak: 'break-word',
    },
    pageButton: {
      root: {
        minWidth: '32px',
        height: '32px',
        fontSize: '12px',
        border: `1px solid ${theme?.palette.neutralLight}`,
        backgroundColor: theme?.palette.white,
        color: theme?.palette.neutralPrimary,
        ':hover': {
          backgroundColor: theme?.palette.neutralLighter,
          borderColor: theme?.palette.neutralSecondary,
        },
      },
      rootChecked: {
        backgroundColor: theme?.palette.themePrimary,
        borderColor: theme?.palette.themePrimary,
        color: theme?.palette.white,
        ':hover': {
          backgroundColor: theme?.palette.themeDark,
        },
      },
    },
  };
};

export const getClassNames = classNamesFunction<IExpandedTableViewStyleProps, IExpandedTableViewStyles>();
