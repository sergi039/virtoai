import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface ISyncButtonProps {
  text: string;
  onClick: () => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ISyncButtonStyleProps, ISyncButtonStyles>;
}

export type ISyncButtonStyleProps = Pick<ISyncButtonProps, 'theme'>;

export interface ISyncButtonStyles {
  root: IStyle;
  button: IStyle;
}