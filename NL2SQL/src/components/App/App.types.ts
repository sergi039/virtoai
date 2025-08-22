import type { IStackStyles, IStyle, ITheme } from '@fluentui/react';

export interface IAppStyleProps {
  theme: ITheme;
}

export interface IAppStyles {
  root: IStyle;
  containerLoading: Partial<IStackStyles>;
}