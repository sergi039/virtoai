import * as React from 'react';
import { Stack, styled } from '@fluentui/react';
import type { IMessagesContainerProps, IMessagesContainerStyleProps, IMessagesContainerStyles } from './MessagesContainer.types';
import { getStyles, getClassNames } from './MessagesContainer.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import { Message } from '../Message/Message';

const MessagesContainerBase: React.FunctionComponent<IMessagesContainerProps> = ({ theme: customTheme, messages }) => {
  const currentTheme = useNL2SQLStore((state) => state.currentTheme);
  const styleProps: IMessagesContainerStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);

  return (
    <Stack className={classNames.root}>
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
    </Stack>
  );
};

export const MessagesContainer = styled<IMessagesContainerProps, IMessagesContainerStyleProps, IMessagesContainerStyles>(
  MessagesContainerBase,
  getStyles,
  undefined,
  { scope: 'MessagesContainer' }
);