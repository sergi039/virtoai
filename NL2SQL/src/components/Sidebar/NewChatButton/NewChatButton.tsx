import * as React from 'react';
import { ActionButton, styled } from '@fluentui/react';
import type { INewChatButtonProps, INewChatButtonStyleProps, INewChatButtonStyles } from './NewChatButton.types';
import { getStyles } from './NewChatButton.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';

const NewChatButtonBase: React.FunctionComponent<INewChatButtonProps> = ({ theme: customTheme }) => {
  const {currentTheme, currentUser, addChat } = useNL2SQLStore();
  const styleProps: INewChatButtonStyleProps = { theme: customTheme || currentTheme };
  const styleNames = getStyles(styleProps);

  const handleNewChat = () => {
    const newChat = { 
      id: Date.now(), 
      title: 'New Chat', 
      userOwnerId: currentUser.id, 
      messages: [], 
      chatUsers: [],
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    addChat(newChat);
  }

  return (
    <ActionButton
      iconProps={{ iconName: 'Add' }}
      text={strings.newChat}
      styles={styleNames.root}
      onClick={handleNewChat}
    />
  );
};

export const NewChatButton = styled<INewChatButtonProps, INewChatButtonStyleProps, INewChatButtonStyles>(
  NewChatButtonBase,
  getStyles,
  undefined,
  { scope: 'NewChatButton' }
);