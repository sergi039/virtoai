import * as React from 'react';
import { Stack, styled } from '@fluentui/react';
import type { ISidebarProps, ISidebarStyleProps, ISidebarStyles } from './Sidebar.types';
import { getStyles, getClassNames } from './Sidebar.styles';
import { useNL2SQLStore } from '../../stores/useNL2SQLStore';
import { NewChatButton } from './NewChatButton';
import { ChatHistory } from './ChatHistory';
import { SidebarFooter } from './SidebarFooter';

const SidebarBase: React.FunctionComponent<ISidebarProps> = ({ theme: customTheme }) => {
  const currentTheme = useNL2SQLStore((state) => state.currentTheme);
  const styleProps: ISidebarStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);

  return (
    <Stack className={classNames.root}>
        <NewChatButton />
        <ChatHistory />
        <SidebarFooter />
    </Stack>
  );
};

export const Sidebar = styled<ISidebarProps, ISidebarStyleProps, ISidebarStyles>(
  SidebarBase,
  getStyles,
  undefined,
  { scope: 'Sidebar' }
);