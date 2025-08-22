import * as React from 'react';
import { Stack, styled } from '@fluentui/react';
import type { IChatContainerProps, IChatContainerStyleProps, IChatContainerStyles } from './ChatContainer.types';
import { getStyles, getClassNames } from './ChatContainer.styles';
import { useNL2SQLStore } from '../../stores/useNL2SQLStore';

const ChatContainerBase: React.FunctionComponent<IChatContainerProps> = ({ children, theme: customTheme }) => {
  const currentTheme = useNL2SQLStore((state) => state.currentTheme);
  const styleProps: IChatContainerStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);

  return (
    <Stack className={classNames.root}>
      {children}
    </Stack>
  )
};

export const ChatContainer = styled<IChatContainerProps, IChatContainerStyleProps, IChatContainerStyles>(
  ChatContainerBase,
  getStyles,
  undefined,
  { scope: 'ChatContainer' }
);