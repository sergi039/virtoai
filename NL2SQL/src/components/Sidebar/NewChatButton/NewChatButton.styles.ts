import { classNamesFunction } from '@fluentui/react';
import type { INewChatButtonStyleProps, INewChatButtonStyles } from './NewChatButton.types';

export const getStyles = (props: INewChatButtonStyleProps): INewChatButtonStyles => {
  const { theme } = props;

  return {
    root: {
      root: {
        margin: '10px',
        padding: '12px',
        border: `1px solid ${theme?.palette.neutralQuaternary}`,
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: theme?.palette.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        height: "47px",
        fontSize: '14px',
        transition: 'all 0.2s',
      },
      rootHovered: {
        color: theme?.palette.white,
        backgroundColor: theme?.palette.themeTertiary,
      },
      iconHovered: {
        color: theme?.palette.white,
      },
      icon: {
        fontSize: '12px',
        color: theme?.palette.white,
      },
      iconPressed: {
        color: theme?.palette.white,
      },
      rootPressed: {
        color: theme?.palette.white,
        backgroundColor: theme?.palette.themeTertiary,
      },
    },
  };
};

export const getClassNames = classNamesFunction<INewChatButtonStyleProps, INewChatButtonStyles>();