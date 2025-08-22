import type { IStyleFunctionOrObject, ITextFieldStyles, IButtonStyles, ITheme, IStyle, IDropdownStyles } from '@fluentui/react';

export interface IInputContainerProps {
  onSubmit: (query: string) => void;
  styles?: IStyleFunctionOrObject<IInputContainerStyleProps, IInputContainerStyles>;
  theme?: ITheme;
}

export type IInputContainerStyleProps = Pick<IInputContainerProps, 'theme'>;

export interface IInputContainerStyles {
  root: IStyle;
  wrapper: IStyle;
  actionsRow: IStyle;
  toolButtons: IStyle;
  voiceButton: Partial<IButtonStyles>;
  modelDropdown: Partial<IDropdownStyles>;
  input: Partial<ITextFieldStyles>;
  submitButton: Partial<IButtonStyles>;
  cancelButton: Partial<IButtonStyles>;
  confirmButton: Partial<IButtonStyles>;
  voiceWaveContainer: IStyle;
  voiceWave: IStyle;
  voiceText: IStyle;
  errorText: IStyle;
  audioVisualizer: IStyle;
  audioBar: IStyle;
}