import type { IStyle, IStyleFunctionOrObject, ITheme, ICommandBarStyles, IDetailsListStyles } from '@fluentui/react';
import { ITableSchema } from '../../../../../api/model/ITableSchema';
import { IServiceRegistry } from '../../../../../api/model/IServiceRegistry';

export interface ITablesSectionProps {
  theme?: ITheme;
  tables: ITableSchema[];
  allTables: ITableSchema[];
  selectedTable: ITableSchema | null;
  serviceName: string;
  serviceRegistrations: IServiceRegistry[];
  isLoading: boolean;
  getTableActiveStatus: (tableName: string) => boolean;
  onTableSelect: (table: ITableSchema | null) => void;
  onAddTable: () => void;
  onEditTable: () => void;
  onDeleteTable: () => void;
  onManageRelations: () => void;
  styles?: IStyleFunctionOrObject<ITablesSectionStyleProps, ITablesSectionStyles>;
}

export type ITablesSectionStyleProps = Pick<ITablesSectionProps, 'theme'>;

export interface ITablesSectionStyles {
  root: IStyle;
  sectionTitle: IStyle;
  commandBar: Partial<ICommandBarStyles>;
  tablesList: Partial<IDetailsListStyles>;
  relationsList: Partial<IDetailsListStyles>;
  loadingContainer: IStyle;
  noRelationsContainer: IStyle;
  noRelationsIcon: IStyle;
  noRelationsText: IStyle;
  relationsContainer: IStyle;
  relationItem: IStyle;
  relationIcon: IStyle;
  relationTableName: IStyle;
  relationColumns: IStyle;
}
