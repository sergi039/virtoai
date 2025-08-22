import {
  Stack,
  Text,
  styled,
  IconButton,
  Icon,
  TextField,
  type ITextField,
} from '@fluentui/react';
import type { IChatItemProps, IChatItemStyleProps, IChatItemStyles } from './ChatItem.types';
import { getStyles } from './ChatItem.styles';
import { useNL2SQLStore } from '../../../../stores/useNL2SQLStore';
import { useEffect, useRef, useState } from 'react';

const ChatItemBase: React.FunctionComponent<IChatItemProps> = ({
  chat,
  setActiveChat,
  isActive,
  onDelete,
  onEdit,
  onManageUsers,
  isBeingDeleted,
  theme: customTheme
}) => {
  const { currentTheme, currentUser } = useNL2SQLStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(chat.title);
  const inputRef = useRef<ITextField>(null);

  const canOperations = chat.userOwnerId === currentUser.id;
  const usersCount = chat.chatUsers?.length + 1 || 0;
  const shouldShowPeopleButton = usersCount > 1;

  const styleProps: IChatItemStyleProps = {
    theme: customTheme || currentTheme,
    isActive,
    showActions: isBeingDeleted,
    shouldShowPeopleButton
  };
  const styleNames = getStyles(styleProps);

  const handleClick = () => setActiveChat?.(chat);

  const handleEditClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (canOperations) {
      setIsEditing(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (canOperations) {
      onDelete?.(chat.id);
    }
  };

  const handleManageUsersClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onManageUsers?.(chat);
  };

  const handleSaveEdit = () => {
    if (canOperations && editedTitle.trim() && editedTitle !== chat.title) {
      onEdit?.(chat.id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(chat.title);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, editedTitle.length]);

  return (
    <Stack
      horizontal
      styles={styleNames.root}
      onClick={handleClick}
      data-is-active={isActive}
    >
      <Icon iconName="Message" styles={styleNames.icon} />

      {isEditing && canOperations ? (
        <TextField
          componentRef={inputRef}
          value={editedTitle}
          onChange={(_, val) => setEditedTitle(val || '')}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          styles={styleNames.editTitle}
        />
      ) : (
        <Stack styles={styleNames.chatContentContainer}>
          <Stack horizontal verticalAlign="center" styles={styleNames.chatTitleContainer}>
            <Text styles={styleNames.text}>
              {chat.title}
            </Text>
          </Stack>
        </Stack>
      )}

      <Stack horizontal styles={styleNames.actions} className="chat-item-actions">
        {canOperations && (
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            styles={styleNames.actionButton}
            onClick={handleEditClick}
          />
        )}
        {canOperations && (
          <IconButton
            id={`delete-icon-${chat.id}`}
            iconProps={{ iconName: 'Delete' }}
            styles={styleNames.actionButton}
            onClick={handleDeleteClick}
          />
        )}
      </Stack>
      
      {canOperations && (
        <Stack horizontal verticalAlign="center" styles={styleNames.usersIconContainer} className="chat-users-container">
          <IconButton
            id={`people-button-${chat.id}`}
            iconProps={{ iconName: 'PeopleAdd' }}
            styles={styleNames.usersActionButton}
            onClick={handleManageUsersClick}
          />
          {usersCount > 1 && (
            <Text styles={styleNames.usersCountText}>
              {usersCount}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export const ChatItem = styled<IChatItemProps, IChatItemStyleProps, IChatItemStyles>(
  ChatItemBase,
  getStyles,
  undefined,
  { scope: 'ChatItem' }
);