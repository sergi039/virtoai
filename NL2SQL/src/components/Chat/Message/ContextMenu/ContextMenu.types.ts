import { ITheme } from '@fluentui/react';

export interface IFluentContextMenuProps {
  isVisible: boolean;
  target: { x: number; y: number } | MouseEvent | Element | null;
  cellValue: any;
  fieldName: string;
  columnName?: string;
  tableName?: string;
  rowData?: Record<string, any>;
  onDismiss: () => void;
  theme?: ITheme;
}

export interface IContextMenuData {
  cellValue: any;
  fieldName: string;
  columnName?: string;
  tableName?: string;
  rowData?: Record<string, any>;
}
