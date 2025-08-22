import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IMessage } from '../../../api/model';

export interface IMessagesContainerProps {
  messages: IMessage[]
  styles?: IStyleFunctionOrObject<IMessagesContainerStyleProps, IMessagesContainerStyles>;
  theme?: ITheme;
}

export type IMessagesContainerStyleProps = Pick<IMessagesContainerProps, 'theme'>;

export interface IMessagesContainerStyles {
  root: IStyle;
}