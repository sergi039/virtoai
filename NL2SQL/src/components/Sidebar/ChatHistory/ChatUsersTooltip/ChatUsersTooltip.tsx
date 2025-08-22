import React, { useMemo, useState, useCallback } from 'react';
import {
  styled,
  Callout,
  DirectionalHint,
  DefaultButton,
  Icon,
  Stack,
  SearchBox,
  Text,
  PrimaryButton,
} from '@fluentui/react';
import type {
  IChatUsersTooltipProps,
  IChatUsersTooltipStyleProps,
  IChatUsersTooltipStyles,
} from './ChatUsersTooltip.types';
import { getStyles, getClassNames } from './ChatUsersTooltip.styles';
import { useNL2SQLStore } from '../../../../stores/useNL2SQLStore';
import strings from '../../../../Ioc/en-us';

const ChatUsersTooltipBase: React.FunctionComponent<IChatUsersTooltipProps> = ({
  theme: customTheme,
  chat,
  targetId,
  isVisible,
  onDismiss,
  onAddUsers,
  onRemoveUser,
}) => {
    const { currentTheme, azureUsers, getCurrentUserId, currentUser } = useNL2SQLStore();
  
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const styleProps: IChatUsersTooltipStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);

  const isOwner = useMemo(() => {
    return currentUser?.id === chat.userOwnerId;
  }, [currentUser, chat.userOwnerId]);

  const chatOwner = useMemo(() => {
    return azureUsers.find(user => user.id === chat.userOwnerId);
  }, [azureUsers, chat.userOwnerId]);

  const chatParticipants = useMemo(() => {
    if (!chat.chatUsers) return [];
    return chat.chatUsers
      .map(chatUser => azureUsers.find(user => user.id === chatUser.userId))
      .filter(Boolean);
  }, [chat.chatUsers, azureUsers]);

  const searchableUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const existingUserIds = new Set([
      chat.userOwnerId,
      ...(chat.chatUsers?.map(cu => cu.userId) || [])
    ]);
    
    const query = searchQuery.toLowerCase();
    return azureUsers
      .filter(user => !existingUserIds.has(user.id))
      .filter(user => 
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
  }, [azureUsers, searchQuery, chat.userOwnerId, chat.chatUsers]);

  const handleAddPeople = useCallback(() => {
    setIsAddMode(true);
    setSearchQuery('');
    setSelectedUserIds([]);
  }, []);

  const handleBackToList = useCallback(() => {
    setIsAddMode(false);
    setSearchQuery('');
    setSelectedUserIds([]);
  }, []);

  const handleSearchChange = useCallback((_: any, newValue?: string) => {
    setSearchQuery(newValue || '');
  }, []);

  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSaveSelection = useCallback(async () => {
    if (onAddUsers && selectedUserIds.length > 0) {
      await onAddUsers(selectedUserIds);
    }
    handleBackToList();
  }, [selectedUserIds, onAddUsers, handleBackToList]);

  const handleLeave = async () => {
    const currentUserId = getCurrentUserId();
    if (onRemoveUser && currentUserId) {
      await onRemoveUser(currentUserId);
    }
  };

  const handleRemoveUserClick = async (userId: string) => {
    if (onRemoveUser) {
      await onRemoveUser(userId);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Callout
      target={`#${targetId}`}
      onDismiss={onDismiss}
      directionalHint={DirectionalHint.rightTopEdge}
      isBeakVisible={false}
      gapSpace={8}
      
    >
      <Stack className={classNames.content}>
        <Stack className={classNames.header} horizontal horizontalAlign="space-between" verticalAlign="center">
          <Stack horizontal verticalAlign="center" style={{ flex: 1 }}>
            {isAddMode ? (
              <>
                <Icon
                  iconName="ChevronLeft"
                  onClick={handleBackToList}
                  style={{ cursor: 'pointer', marginRight: '8px', fontSize: '14px' }}
                />
                <Text>{strings.Chat.ToolTips.addPeople}</Text>
              </>
            ) : (
              <Text>{`People (${(chatOwner ? 1 : 0) + chatParticipants.length})`}</Text>
            )}
          </Stack>
          <Icon
            iconName="Cancel"
            onClick={onDismiss}
            className={classNames.closeIcon}
          />
        </Stack>

        {isAddMode ? (
          <>
            <SearchBox
              placeholder={strings.Chat.ToolTips.addPeopleSearch}
              value={searchQuery}
              onChange={handleSearchChange}
              styles={styleNames.searchInput}
            />

            {searchQuery.trim() ? (
              <Stack className={classNames.usersList}>
                {searchableUsers.length > 0 ? (
                  searchableUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`${classNames.userItem} ${
                        selectedUserIds.includes(user.id) ? classNames.userItemSelected : ''
                      }`}
                      onClick={() => handleUserSelect(user.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className={classNames.userAvatar}
                        />
                      ) : (
                        <Stack className={classNames.userAvatar}>
                          {getInitials(user.name)}
                        </Stack>
                      )}

                      <Stack className={classNames.userInfo}>
                        <Stack className={classNames.userName}>{user.name}</Stack>
                        {user.email && (
                          <Stack className={classNames.userEmail}>{user.email}</Stack>
                        )}
                      </Stack>

                      {selectedUserIds.includes(user.id) && (
                        <Icon
                          iconName="CheckMark"
                          styles={styleNames.iconCheck}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <Text styles={styleNames.searchText}>{strings.Chat.ToolTips.noUsersFound}</Text>
                )}
              </Stack>
            ) : (
              <Text styles={styleNames.searchText}>
                {strings.Chat.ToolTips.startTypingToSearch}
              </Text>
            )}

            <div className={classNames.footer}>
              <div className={classNames.actions}>
                <PrimaryButton
                  text={`${strings.btnAdd} (${selectedUserIds.length})`}
                  onClick={handleSaveSelection}
                  disabled={selectedUserIds.length === 0}
                  styles={styleNames.saveButton}
                />
                <DefaultButton
                  text={strings.btnCancel}
                  onClick={handleBackToList}
                  styles={styleNames.cancelButton}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <Stack className={classNames.usersList}>
              {chatOwner && (
                <div className={classNames.userItem}>
                  {chatOwner.photoUrl ? (
                    <img
                      src={chatOwner.photoUrl}
                      alt={chatOwner.name}
                      className={classNames.userAvatar}
                    />
                  ) : (
                    <Stack className={classNames.userAvatar}>
                      {getInitials(chatOwner.name)}
                    </Stack>
                  )}

                  <Stack className={classNames.userInfo}>
                    <Stack className={classNames.userName}>{chatOwner.name}</Stack>
                    <Stack className={classNames.userRole}>{strings.Chat.ToolTips.youLabel}</Stack>
                  </Stack>
                </div>
              )}

              {chatParticipants.map((user) => {
                if (!user) return null;
                
                return (
                  <div key={user.id} className={classNames.userItem}>
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className={classNames.userAvatar}
                      />
                    ) : (
                      <Stack className={classNames.userAvatar}>
                        {getInitials(user.name)}
                      </Stack>
                    )}

                    <Stack className={classNames.userInfo}>
                      <Stack className={classNames.userName}>{user.name}</Stack>
                    </Stack>

                    {isOwner && (
                      <Icon
                        iconName="Cancel"
                        className={`${classNames.removeUserIcon} remove-user-icon`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveUserClick(user.id);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </Stack>


            <div className={classNames.footer}>
              <div className={classNames.actions}>
                {isOwner && (
                  <DefaultButton
                    text={strings.Chat.ToolTips.addPeople}
                    onClick={handleAddPeople}
                    styles={styleNames.addButton}
                    iconProps={{ iconName: 'Add' }}
                  />
                )}
                {!isOwner && (
                  <DefaultButton
                    text={strings.Chat.ToolTips.leave}
                    onClick={handleLeave}
                    styles={styleNames.leaveButton}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </Stack>
    </Callout>
  );
};

export const ChatUsersTooltip = styled<
  IChatUsersTooltipProps,
  IChatUsersTooltipStyleProps,
  IChatUsersTooltipStyles
>(ChatUsersTooltipBase, getStyles, undefined, { scope: 'ChatUsersTooltip' });
