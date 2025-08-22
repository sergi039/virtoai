import type { IStackStyles, IStyleFunctionOrObject, IButtonStyles, ITextStyles, ITheme, IIconStyles, ITextFieldStyles } from '@fluentui/react';
import { IChat } from '../../../../api/model';

export interface IChatItemProps {
  chat: IChat;
  isActive: boolean;
  isBeingDeleted: boolean;
  setActiveChat: (chat: IChat) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
  onManageUsers?: (chat: IChat) => void;
  styles?: IStyleFunctionOrObject<IChatItemStyleProps, IChatItemStyles>;
  theme?: ITheme;
}

export interface IChatItemStyleProps {
  theme: ITheme;
  isActive: boolean;
  showActions: boolean;
  shouldShowPeopleButton?: boolean;
}

export interface IChatItemStyles {
  root: Partial<IStackStyles>;
  text: Partial<ITextStyles>;
  actions: Partial<IStackStyles>;
  actionButton: Partial<IButtonStyles>;
  usersActionButton: Partial<IButtonStyles>;
  icon: Partial<IIconStyles>;
  editTitle: Partial<ITextFieldStyles>;
  chatContentContainer: Partial<IStackStyles>;
  chatTitleContainer: Partial<IStackStyles>;
  usersIconContainer: Partial<IStackStyles>;
  usersIcon: Partial<IIconStyles>;
  usersCountText: Partial<ITextStyles>;
}