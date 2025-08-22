import { classNamesFunction } from '@fluentui/react';
import { ISchemaEditorStyleProps, ISchemaEditorStyles } from './SchemaEditor.types';

export const getStyles = (props: ISchemaEditorStyleProps): ISchemaEditorStyles => {
  const { theme } = props;

  return {
    root: {
      padding: '16px',
      backgroundColor: theme?.palette.white,
      color: theme?.palette.neutralPrimary,
    },
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
        padding: '20px',
      },
    },
  };
};

export const getClassNames = classNamesFunction<ISchemaEditorStyleProps, ISchemaEditorStyles>();
