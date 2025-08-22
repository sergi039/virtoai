import { IButtonStyles, IDetailsListStyles, IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IDataTableProps {
  data: Array<Record<string, any>>;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onCellClick: (value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => void;
  onCellRightClick: (event: React.MouseEvent, value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => void;
  isCellClickable: (tableName: string, columnName: string, rowData?: Record<string, any>) => boolean;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IDataTableStyleProps, IDataTableStyles>;
  strings: any;
}

export type IDataTableStyleProps = Pick<IDataTableProps, 'theme'>;

export interface IDataTableStyles {
  tableContainer: IStyle;
  detailsList: Partial<IDetailsListStyles>;
  redirectText: IStyle;
  clickableCell: IStyle;
  pageButton: Partial<IButtonStyles>;
}
