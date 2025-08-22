import type { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ITableSchema } from '../../../../../api/model/ITableSchema';

export interface ITableEditorProps {
  theme?: ITheme;
  table: ITableSchema;
  tableNames?: ITableSchema[];
  isActive?: boolean;
  onTableChange?: (table: ITableSchema, isActive?: boolean) => void;
  styles?: IStyleFunctionOrObject<ITableEditorStyleProps, ITableEditorStyles>;
}

export type ITableEditorStyleProps = Pick<ITableEditorProps, 'theme'>;

export interface ITableEditorStyles {
  root: IStyle;
  content: IStyle;
  formContainer: IStyle;
  footer: IStyle;
  buttonGroup: IStyle;
}
