import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IMainLayoutProps {
  styles?: IStyleFunctionOrObject<IMainLayoutStyleProps, IMainLayoutStyles>;
  theme?: ITheme;
}

export type IMainLayoutStyleProps = Pick<IMainLayoutProps, 'theme'>;

export interface IMainLayoutStyles {
  root: IStyle;
  title: IStyle;
  emptyContainer: IStyle;
  mainContainer: IStyle;
  fullWidthInputContainer: IStyle;
}