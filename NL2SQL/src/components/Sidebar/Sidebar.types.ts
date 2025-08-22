import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface ISidebarProps {
  styles?: IStyleFunctionOrObject<ISidebarStyleProps, ISidebarStyles>;
  theme?: ITheme;
}

export type ISidebarStyleProps = Pick<ISidebarProps, 'theme'>;

export interface ISidebarStyles {
  root: IStyle;
}