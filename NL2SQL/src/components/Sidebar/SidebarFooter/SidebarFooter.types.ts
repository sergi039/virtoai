import type { IButtonStyles, IContextualMenuStyles, IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface ISidebarFooterProps {
  text?: string;
  styles?: IStyleFunctionOrObject<ISidebarFooterStyleProps, ISidebarFooterStyles>;
  theme?: ITheme;
}

export type ISidebarFooterStyleProps = Pick<ISidebarFooterProps, 'theme'>;

export interface ISidebarFooterStyles {
  root: IStyle;
  button: Partial<IButtonStyles>;
  avatar: IStyle;
  text: IStyle;
  menu: Partial<IContextualMenuStyles>;
}