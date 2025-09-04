import { ITheme, IStyleFunctionOrObject, IStyle, ISearchBoxStyles, ITextStyles, IIconStyles, IButtonStyles } from '@fluentui/react';
import { IChat } from '../../../../api/model';

export interface IChatUsersTooltipProps {
  theme?: ITheme;
  chat: IChat;
  targetId: string;
  isVisible: boolean;
  onDismiss: () => void;
  onAddUsers?: (userIds: string[]) => Promise<void>;
  onRemoveUser?: (userId: string) => Promise<void>;
  styles?: IStyleFunctionOrObject<IChatUsersTooltipStyleProps, IChatUsersTooltipStyles>;
}

export interface IChatUsersTooltipStyleProps {
  theme: ITheme;
}

export interface IChatUsersTooltipStyles {
  content: IStyle;
  header: IStyle;
  headerLeft: IStyle;
  backIcon: IStyle;
  searchBox: IStyle;
  usersList: IStyle;
  userItem: IStyle;
  userItemSelected: IStyle;
  selectableUserItem: IStyle;
  userAvatar: IStyle;
  userInfo: IStyle;
  userName: IStyle;
  userEmail: IStyle;
  userRole: IStyle;
  footer: IStyle;
  selectedCount: IStyle;
  actions: IStyle;
  removeUserIcon: IStyle;
  closeIcon: IStyle;
  searchInput: Partial<ISearchBoxStyles>;
  searchText: Partial<ITextStyles>;
  iconCheck: Partial<IIconStyles>;
  saveButton: Partial<IButtonStyles>;
  cancelButton: Partial<IButtonStyles>;
  addButton: Partial<IButtonStyles>;
  leaveButton: Partial<IButtonStyles>;
}