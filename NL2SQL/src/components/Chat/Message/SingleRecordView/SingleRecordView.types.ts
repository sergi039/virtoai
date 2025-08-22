import { ITheme } from '@fluentui/react';

export interface ISingleRecordViewProps {
  record: Record<string, any>;
  onCellClick: (value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => void;
  onCellRightClick: (event: React.MouseEvent, value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => void;
  isCellClickable: (tableName: string, columnName: string, rowData?: Record<string, any>) => boolean;
  theme: ITheme;
  strings: any;
}

export interface ISingleRecordViewStyleProps {
  theme: ITheme;
}

export interface ISingleRecordViewStyles {
  containerSingleMessage: any;
  fieldContainerSingleMessage: any;
  fieldLabelSingleMessage: any;
  fieldValueSingleMessage: any;
  redirectText: any;
}
