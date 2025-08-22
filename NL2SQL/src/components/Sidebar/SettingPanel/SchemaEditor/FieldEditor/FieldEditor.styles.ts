import { classNamesFunction } from '@fluentui/react';
import { IFieldEditorStyleProps, IFieldEditorStyles } from './FieldEditor.types';

export const getStyles = (props: IFieldEditorStyleProps): IFieldEditorStyles => {
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
      padding: '8px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    toggleGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px',
      backgroundColor: theme?.palette.neutralLighterAlt,
      borderRadius: '4px',
      border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
    },
    footer: {
      padding: '16px 8px',
      borderTop: `1px solid ${theme?.palette.neutralTertiaryAlt}`,
      backgroundColor: theme?.palette.white,
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px',
      width: '100%',
    },
    fieldStyle: {
      root: {
        flex: 1
      }
    },
    contextMenuSection: {
      marginTop: '24px',
      padding: '10px',
      backgroundColor: theme?.palette.neutralLighterAlt,
      borderRadius: '6px',
      border: `1px solid ${theme?.palette.neutralQuaternaryAlt}`,
    },
    contextMenuHeader: {
      fontWeight: '600',
      color: theme?.palette.neutralPrimary,
    },
    contextMenuHeaderBlock: {
      marginBottom: '12px',
    },
    contextMenuInputContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-end',
      marginBottom: '16px',
    },
    contextMenuInputField: {
      flex: 1,
    },
    contextMenuList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    contextMenuItem: {
      padding: '12px',
      backgroundColor: theme?.palette.white,
      border: `1px solid ${theme?.palette.neutralTertiaryAlt}`,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        borderColor: theme?.palette.themePrimary,
        boxShadow: `0 2px 4px ${theme?.palette.neutralQuaternaryAlt}`,
      },
    },
    contextMenuItemEditing: {
      padding: '12px',
      backgroundColor: theme?.palette.themeLighterAlt,
      border: `2px solid ${theme?.palette.themePrimary}`,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    contextMenuItemText: {
      flex: 1,
      fontWeight: '500',
      color: theme?.palette.neutralPrimary,
    },
    contextMenuItemActions: {
      display: 'flex',
      gap: '4px',
    },
    noItemsText: {
      fontStyle: 'italic',
      color: theme?.palette.neutralSecondary,
      textAlign: 'center',
      padding: '16px',
      backgroundColor: theme?.palette.white,
      border: `1px dashed ${theme?.palette.neutralTertiaryAlt}`,
      borderRadius: '4px',
    }
  };
};

export const getClassNames = classNamesFunction<IFieldEditorStyleProps, IFieldEditorStyles>();
