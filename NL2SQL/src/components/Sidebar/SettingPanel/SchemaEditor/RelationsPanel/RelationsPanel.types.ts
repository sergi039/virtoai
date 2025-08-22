import { ITheme, IStyleFunctionOrObject } from '@fluentui/react';
import { IServiceRegistry } from '../../../../../api/model/IServiceRegistry';
import { ITableSchema } from '../../../../../api/model/ITableSchema';
import { RelationType } from '../../../../../api/constants/relationType';
import { JoinType } from '../../../../../api/constants/joinType';
import { CascadeType } from '../../../../../api/constants/cascadeType';

export interface IRelationsPanelProps {
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<IRelationsPanelStyleProps, IRelationsPanelStyles>;
  isOpen: boolean;
  selectedService: string | null;
  selectedTable: ITableSchema | null;
  serviceRegistrations: IServiceRegistry[];
  allTables: ITableSchema[];
  onDismiss: () => void;
  onRelationChanged?: () => void;
}

export interface IRelationsPanelStyleProps {
  theme: ITheme;
}

export interface IRelationsPanelStyles {
  root: string;
  header: string;
  content: string;
  section: string;
  sectionTitle: string;
  formContainer: string;
  dropdown: string;
  relationItem: string;
  relationInfo: string;
  relationActions: string;
  footer: string;
  loadingContainer: string;
  buttonGroup: string;
}

export interface ITableRelation {
  id?: string;
  sourceServiceId: number;
  sourceTableName: string;
  sourceColumnName: string;
  targetServiceId: number;
  targetTableName: string;
  targetColumnName: string;
  relationType: RelationType;
  joinType?: JoinType;
  constraintName?: string;
  junctionTableName?: string; 
  onUpdateAction?: CascadeType;
  onDeleteAction?: CascadeType;
}

export interface ITableRelationDisplay extends ITableRelation {
  sourceServiceName: string;
  targetServiceName: string;
}
