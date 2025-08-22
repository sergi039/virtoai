import type { IStackStyles, IStyleFunctionOrObject, ITextFieldStyles, ITheme } from '@fluentui/react';

export interface ICommentContainerProps {
  isVisible: boolean;
  onCommentChange: (text: string) => void;
  styles?: IStyleFunctionOrObject<ICommentContainerStyleProps, ICommentContainerStyles>;
  theme?: ITheme;
}

export type ICommentContainerStyleProps = Pick<ICommentContainerProps, 'theme'> & {
  isVisible: boolean;
};

export interface ICommentContainerStyles {
  root: Partial<IStackStyles>;
  input: Partial<ITextFieldStyles>;
}