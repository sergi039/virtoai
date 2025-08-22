import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IChatHistoryProps {
  styles?: IStyleFunctionOrObject<IChatHistoryStyleProps, IChatHistoryStyles>;
  theme?: ITheme;
}

export type IChatHistoryStyleProps = Pick<IChatHistoryProps, 'theme'>;

export interface IChatHistoryStyles {
  root: IStyle;
  header: IStyle;
  categoryHeader: IStyle;
  list: IStyle;
  callout: IStyle;
  calloutContent: IStyle;
}