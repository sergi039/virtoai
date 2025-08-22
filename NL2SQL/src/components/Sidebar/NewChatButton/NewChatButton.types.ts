import type { IButtonStyles, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface INewChatButtonProps {
  styles?: IStyleFunctionOrObject<INewChatButtonStyleProps, INewChatButtonStyles>;
  theme?: ITheme;
}

export type INewChatButtonStyleProps = Pick<INewChatButtonProps, 'theme'>;

export interface INewChatButtonStyles {
  root: Partial<IButtonStyles>;
}