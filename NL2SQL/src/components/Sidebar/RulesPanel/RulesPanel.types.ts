import { ITheme, IStyleFunctionOrObject } from '@fluentui/react';

export interface IRulesPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IRulesPanelStyleProps, IRulesPanelStyles>;
}

export interface IRulesPanelStyleProps {
  theme: ITheme;
}

export interface IRulesPanelStyles {
  panel?: any;
  header?: any;
  content?: any;
}
