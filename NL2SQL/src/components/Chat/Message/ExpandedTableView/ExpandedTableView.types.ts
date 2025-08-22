import type { IStyle, IStyleFunctionOrObject, ITheme, IDetailsListStyles, IButtonStyles, IPanelStyles } from '@fluentui/react';

export interface IExpandedTableViewProps {
  isOpen: boolean;
  data: Array<Record<string, any>>;
  onClose: () => void;
  onCellClick?: (value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => void;
  isCellClickable?: (tableName: string, columnName: string, rowData?: Record<string, any>) => boolean;
  styles?: IStyleFunctionOrObject<IExpandedTableViewStyleProps, IExpandedTableViewStyles>;
  theme?: ITheme;
}

export type IExpandedTableViewStyleProps = Pick<IExpandedTableViewProps, 'theme'>;

export interface IExpandedTableViewStyles {
  panel: Partial<IPanelStyles>;
  content: IStyle;
  tableContainer: IStyle;
  detailsList: Partial<IDetailsListStyles>;
  paginationContainer: IStyle;
  pageButton: Partial<IButtonStyles>;
  pageInfo: IStyle;
  redirectText: IStyle;
}
