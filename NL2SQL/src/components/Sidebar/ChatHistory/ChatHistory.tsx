import { Stack, Text, styled, Callout, DirectionalHint, PrimaryButton, DefaultButton } from '@fluentui/react';
import type { IChatHistoryProps, IChatHistoryStyleProps, IChatHistoryStyles } from './ChatHistory.types';
import { getStyles, getClassNames } from './ChatHistory.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';
import { useMemo, useState } from 'react';
import { IChat } from '../../../api/model';
import toast from 'react-hot-toast';
import { ChatItem } from './ChatItem';
import { ChatUsersTooltip } from './ChatUsersTooltip';
import { DateChatUtils } from '../../../utils/dateChatUtils';

const ChatHistoryBase: React.FunctionComponent<IChatHistoryProps> = ({
  theme: customTheme,
}) => {
  const { currentTheme, chats, editChat, deleteChat, currentChat, setCurrentChat, addChatUser, removeChatUser, azureUsers, getAllChats } = useNL2SQLStore();
  const styleProps: IChatHistoryStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);
  const [calloutVisible, setCalloutVisible] = useState<boolean>(false);
  const [usersTooltipVisible, setUsersTooltipVisible] = useState<boolean>(false);
  const [selectedChatForUsers, setSelectedChatForUsers] = useState<IChat | null>(null);

  const groupedChats = useMemo(() => {
    const groups: Record<string, IChat[]> = {};
    
    chats.forEach(chat => {
      const category = DateChatUtils.getDateCategory(chat.updatedAt);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(chat);
    });
    
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });

    return groups;
  }, [chats]);

  const sortedGroupNames = useMemo(() => {
    return Object.keys(groupedChats).sort((a, b) => {
      const maxUpdatedAtA = Math.max(...groupedChats[a].map(chat => new Date(chat.updatedAt).getTime()));
      const maxUpdatedAtB = Math.max(...groupedChats[b].map(chat => new Date(chat.updatedAt).getTime()));
      return maxUpdatedAtB - maxUpdatedAtA;
    });
  }, [groupedChats]);

  const handleDeleteClick = (id: number) => {
    setChatToDelete(id);
    setCalloutVisible(true);
  };
  
  const handleConfirmDelete = () => {
    if (chatToDelete !== null) {
      deleteChat(chatToDelete);
      if (currentChat && currentChat.id === chatToDelete) {
        setCurrentChat(null);
      }
      setChatToDelete(null);
      setCalloutVisible(false);
    }
  };
  
  const handleEditChat = (id: number, newTitle: string) => {
    let chatToEdit = chats.find(chat => chat.id === id);

    if (!chatToEdit) {
      return;
    }

    chatToEdit.title = newTitle;
    editChat(id, chatToEdit);
  };

  const handleManageUsers = (chat: IChat) => {
    setSelectedChatForUsers(chat);
    setUsersTooltipVisible(true);
  };

  const handleCloseTooltipUsers = () => {
    setUsersTooltipVisible(false);
    setSelectedChatForUsers(null);
  };

  const handleAddUsersToChat = async (userIds: string[]) => {
    if (!selectedChatForUsers) return;

    try {
      for (const userId of userIds) {
        const userProfile = azureUsers.find((user: any) => user.id === userId);
        if (!userProfile) continue;

        const newChatUser = {
          id: 0,
          chatId: selectedChatForUsers.id,
          userId: userId,
          userName: userProfile.name,
          email: userProfile.email || '',
          photoUrl: userProfile.photoUrl || undefined,
          joinedAt: new Date()
        };
        await addChatUser(newChatUser);
      }
      
      const updatedChats = await getAllChats();
      const updatedChat = updatedChats.find((c: IChat) => c.id === selectedChatForUsers.id);
      if (updatedChat) {
        setSelectedChatForUsers(updatedChat);
        if (currentChat && currentChat.id === selectedChatForUsers.id) {
          setCurrentChat(updatedChat);
        }
      }
      
      toast.success(strings.Chat.UserManagement.userAddedSuccess);
    } catch (error) {
      console.error('Error adding users to chat:', error);
      toast.error(strings.Chat.UserManagement.userAddedError);
    }
  };

  const handleRemoveUserFromChat = async (userId: string) => {
    if (!selectedChatForUsers || !selectedChatForUsers.chatUsers) return;

    try {
      const chatUserToRemove = selectedChatForUsers.chatUsers.find(cu => cu.userId === userId);
      if (chatUserToRemove) {
        await removeChatUser(chatUserToRemove.id);
        
        const updatedChats = await getAllChats();
        const updatedChat = updatedChats.find((c: IChat) => c.id === selectedChatForUsers.id);
        if (updatedChat) {
          setSelectedChatForUsers(updatedChat);
          if (currentChat && currentChat.id === selectedChatForUsers.id) {
            setCurrentChat(updatedChat);
          }
        }
        
        toast.success(strings.Chat.UserManagement.userRemovedSuccess);
      }
    } catch (error) {
      console.error('Error removing user from chat:', error);
      toast.error(strings.Chat.UserManagement.userRemovedError);
    }
  };

  return (
    <Stack className={classNames.root}>
      <Stack className={classNames.list}>
        {sortedGroupNames.map(category => {
          if (!groupedChats[category] || groupedChats[category].length === 0) {
            return null;
          }
          
          return (
            <Stack key={category}>
              <Text className={classNames.categoryHeader}>{category}</Text>
              {groupedChats[category].map((chat) => (
                <ChatItem 
                  chat={chat} 
                  isActive={currentChat ? chat.id === currentChat.id : false} 
                  setActiveChat={setCurrentChat} 
                  onDelete={handleDeleteClick} 
                  onEdit={handleEditChat}
                  onManageUsers={handleManageUsers}
                  isBeingDeleted={chat.id === chatToDelete && calloutVisible}
                  key={chat.id} 
                />
              ))}
            </Stack>
          );
        })}
      </Stack>
      
      {calloutVisible && chatToDelete !== null && (
        <Callout
          target={`#delete-icon-${chatToDelete}`}
          onDismiss={() => setCalloutVisible(false)}
          directionalHint={DirectionalHint.bottomCenter}
          className={classNames.callout}
        >
          <Stack tokens={{ childrenGap: 10 }} className={classNames.calloutContent}>
            <Text>{strings.Chat.deleteChatConfirmation}</Text>
            <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-between">
              <PrimaryButton 
                text={strings.btnDelete} 
                onClick={handleConfirmDelete} 
              />
              <DefaultButton 
                text={strings.btnCancel} 
                onClick={() => setCalloutVisible(false)} 
              />
            </Stack>
          </Stack>
        </Callout>
      )}

      {selectedChatForUsers && (
        <ChatUsersTooltip
          isVisible={usersTooltipVisible}
          chat={selectedChatForUsers}
          targetId={`people-button-${selectedChatForUsers.id}`}
          onDismiss={handleCloseTooltipUsers}
          onAddUsers={handleAddUsersToChat}
          onRemoveUser={handleRemoveUserFromChat}
          theme={customTheme || currentTheme}
        />
      )}
    </Stack>
  );
};

export const ChatHistory = styled<IChatHistoryProps, IChatHistoryStyleProps, IChatHistoryStyles>(
  ChatHistoryBase,
  getStyles,
  undefined,
  { scope: 'ChatHistory' }
);