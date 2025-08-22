import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { MessageBarType } from '@fluentui/react';

export interface IMessageBarWrapperProps {
  theme?: ITheme;
  message: { text: string; type: MessageBarType } | null;
  onDismiss: () => void;
  styles?: IStyleFunctionOrObject<IMessageBarWrapperStyleProps, IMessageBarWrapperStyles>;
}

export type IMessageBarWrapperStyleProps = Pick<IMessageBarWrapperProps, 'theme'>;

export interface IMessageBarWrapperStyles {
  root: IStyle;
  messageBar: IStyle;
}
