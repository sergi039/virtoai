import { classNamesFunction } from '@fluentui/react';
import { ITableEditorStyleProps, ITableEditorStyles } from './TableEditor.types';

export const getStyles = (props: ITableEditorStyleProps): ITableEditorStyles => {
  const { theme } = props;

  return {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme?.palette.white,
      color: theme?.palette.neutralPrimary,
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '16px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    footer: {
      padding: '16px',
      borderTop: `1px solid ${theme?.palette.neutralTertiaryAlt}`,
      backgroundColor: theme?.palette.white,
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'space-between',
      width: '100%',
    },
  };
};

export const getClassNames = classNamesFunction<ITableEditorStyleProps, ITableEditorStyles>();
