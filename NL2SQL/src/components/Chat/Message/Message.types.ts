import type { IButtonStyles, IDetailsListStyles, IIconStyles, IMessageBarStyles, IPivotStyles, IStyle, IStyleFunctionOrObject, ITextFieldStyles, ITheme } from '@fluentui/react';
import { IMessage } from '../../../api/model';

export interface IMessageProps {
  message: IMessage;
  styles?: IStyleFunctionOrObject<IMessageStyleProps, IMessageStyles>;
  theme?: ITheme;
}

export type IMessageStyleProps = Pick<IMessageProps, 'theme'> & {
  isUser: boolean;
};

export interface IMessageStyles {
  root: IStyle;
  contentUser: IStyle;
  contentAI: IStyle;
  buttonRow: IStyle;
  messageEmptyData: Partial<IMessageBarStyles>;
  userMessageContainer: IStyle;
  userMessageCopyButton: IStyle;
  userMessageCopyButtonVisible: IStyle;
  iconButton: IStyle;
  userMessageCopyIcon: IStyle;
  iconButtonActive: IStyle;
  iconButtonFeedbackActive: Partial<IIconStyles>;
  pageButton: Partial<IButtonStyles>;
  navButtonStyles: Partial<IButtonStyles>;
  containerSingleMessage: IStyle;
  fieldContainerSingleMessage: IStyle;
  fieldLabelSingleMessage: IStyle;
  fieldValueSingleMessage: IStyle;
  sqlEditorContainer: IStyle;
  sqlEditorContainerHidden: IStyle;
  sqlEditorActions: IStyle;
  sqlEditorTextField: Partial<ITextFieldStyles>;
  sqlEditorReadOnly: IStyle;
  tableContainer: IStyle;
  detailsList: Partial<IDetailsListStyles>;
  loadingDots: IStyle;
  loadingDot: IStyle;
  redirectText: IStyle;
  loadingTabContent: IStyle;
  pivotStyles: Partial<IPivotStyles>;
  pivotItemStyles: IStyle;
  aiQuestionContainer: IStyle;
  aiQuestionIcon: IStyle;
  aiQuestionContent: IStyle;
  aiQuestionText: IStyle;
  suggestionsContainer: IStyle;
  suggestionsTitle: IStyle;
  suggestionsList: IStyle;
  suggestionButton: Partial<IButtonStyles>;
  suggestionButtonDisabled: Partial<IButtonStyles>;
  questionsContainer: IStyle;
  questionsTitle: IStyle;
  suggestionsTextContainer: IStyle;
  suggestionsTextTitle: IStyle;
  suggestionsTextList: IStyle;
  suggestionTextItem: IStyle;
  suggestionTextItemClickable: IStyle;
}