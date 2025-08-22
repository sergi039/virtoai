import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IExampleQuery {
  title: string;
  text: string;
}

export interface IExamplesContainerProps {
  examples: IExampleQuery[];
  onExampleClick: (text: string) => void;
  styles?: IStyleFunctionOrObject<IExamplesContainerStyleProps, IExamplesContainerStyles>;
  theme?: ITheme;
}

export type IExamplesContainerStyleProps = Pick<IExamplesContainerProps, 'theme'>;

export interface IExamplesContainerStyles {
  root: IStyle;
  grid: IStyle;
  example: IStyle;
  exampleTitle: IStyle;
  exampleText: IStyle;
}