import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IChatContainerProps {
  children: React.ReactNode;
  styles?: IStyleFunctionOrObject<IChatContainerStyleProps, IChatContainerStyles>;
  theme?: ITheme;
}

export type IChatContainerStyleProps = Pick<IChatContainerProps, 'theme'>;

export interface IChatContainerStyles {
  root: IStyle;
  messagesArea: IStyle;
  inputArea: IStyle;
}