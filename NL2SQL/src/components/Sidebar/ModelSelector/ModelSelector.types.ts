import type { IDropdownStyles, IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IModelSelectorProps {
  styles?: IStyleFunctionOrObject<IModelSelectorStyleProps, IModelSelectorStyles>;
  theme?: ITheme;
}

export type IModelSelectorStyleProps = Pick<IModelSelectorProps, 'theme'>;

export interface IModelSelectorStyles {
  root: IStyle;
  title: IStyle;
  content: IStyle;
  dropdown: Partial<IDropdownStyles>;
}