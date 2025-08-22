import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IToggleConfig {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface IToggleRowProps {
  toggles: IToggleConfig[];
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IToggleRowStyleProps, IToggleRowStyles>;
}

export type IToggleRowStyleProps = Pick<IToggleRowProps, 'theme'> & {
  togglesLength?: number;
}

export interface IToggleRowStyles {
  root: IStyle;
  toggleItem: IStyle;
}