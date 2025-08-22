import type { IStyle, IStyleFunctionOrObject, ITextFieldStyles, ITheme } from '@fluentui/react';
import { IDropdownOption } from '@fluentui/react';
import { ITableField } from '../../../../../api/model/ITableSchema';
import { FieldContextMenuItem } from '../../../../../api/model/IServiceRegistry';

export interface IFieldEditorProps {
  theme?: ITheme;
  field: ITableField;
  existingFields: ITableField[];
  tableName?: string;
  onFieldChange?: (field: ITableField) => void;
  onValuesChange?: (values: {
    field: ITableField;
    redirectUrl: string;
    originalRedirectUrl: string;
    isHidden: boolean;
    contextMenuItems: FieldContextMenuItem[];
    originalContextMenuItems: FieldContextMenuItem[];
  }) => void;
  postgresqlFieldTypes: IDropdownOption[];
  styles?: IStyleFunctionOrObject<IFieldEditorStyleProps, IFieldEditorStyles>;
}

export type IFieldEditorStyleProps = Pick<IFieldEditorProps, 'theme'>;

export interface IFieldEditorStyles {
  root: IStyle;
  content: IStyle;
  formContainer: IStyle;
  toggleGroup: IStyle;
  footer: IStyle;
  buttonGroup: IStyle;
  fieldStyle: Partial<ITextFieldStyles>;
  contextMenuSection: IStyle;
  contextMenuHeaderBlock: IStyle;
  contextMenuHeader: IStyle;
  contextMenuInputContainer: IStyle;
  contextMenuInputField: IStyle;
  contextMenuList: IStyle;
  contextMenuItem: IStyle;
  contextMenuItemEditing: IStyle;
  contextMenuItemText: IStyle;
  contextMenuItemActions: IStyle;
  noItemsText: IStyle;
}
