import { classNamesFunction } from '@fluentui/react';
import type { IDataTableStyleProps, IDataTableStyles } from './DataTable.types';

export const getStyles = (props: IDataTableStyleProps): IDataTableStyles => {
  const { theme } = props;

  return {
    tableContainer: {
      overflow: 'auto',
      maxHeight: '400px',
      border: `1px solid ${theme?.palette.neutralLight}`,
      borderRadius: '4px',
    },
    detailsList: {
      root: {
        '.ms-DetailsHeader': {
          borderBottom: `1px solid ${theme?.palette.neutralLight}`,
        },
        '.ms-DetailsRow': {
          borderBottom: `1px solid ${theme?.palette.neutralLighter}`,
          ':hover': {
            backgroundColor: theme?.palette.neutralLighter,
          },
        },
        '.ms-DetailsRow-cell': {
          padding: '8px 12px',
          fontSize: '13px',
          lineHeight: '16px',
        },
      },
    },
    redirectText: {
      color: theme?.palette.themePrimary,
      cursor: 'pointer',
      textDecoration: 'underline',
      ':hover': {
        color: theme?.palette.themeDarkAlt,
      },
    },
    clickableCell: {
      cursor: 'pointer',
      ':hover': {
        backgroundColor: theme?.palette.neutralLighter,
      },
    },
    pageButton: {
      root: {
        minWidth: '32px',
        height: '28px',
        fontSize: '12px',
        border: `1px solid ${theme?.palette.neutralLight}`,
        backgroundColor: theme?.palette.white,
        color: theme?.palette.neutralPrimary,
      },
      rootChecked: {
        backgroundColor: theme?.palette.themePrimary,
        color: theme?.palette.white,
        borderColor: theme?.palette.themePrimary,
      },
      rootHovered: {
        backgroundColor: theme?.palette.neutralLighter,
        borderColor: theme?.palette.neutralTertiary,
      },
    },
  };
};

export const getClassNames = classNamesFunction<IDataTableStyleProps, IDataTableStyles>();
