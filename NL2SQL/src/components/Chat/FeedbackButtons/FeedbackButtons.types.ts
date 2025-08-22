import type { IStackStyles, IStyleFunctionOrObject, IButtonStyles, ITheme } from '@fluentui/react';

export interface IFeedbackButtonsProps {
  onPositiveClick: () => void;
  onNegativeClick: () => void;
  styles?: IStyleFunctionOrObject<IFeedbackButtonsStyleProps, IFeedbackButtonsStyles>;
  theme?: ITheme;
}

export type IFeedbackButtonsStyleProps = Pick<IFeedbackButtonsProps, 'theme'>;

export interface IFeedbackButtonsStyles {
  root: Partial<IStackStyles>;
  button: Partial<IButtonStyles>;
}