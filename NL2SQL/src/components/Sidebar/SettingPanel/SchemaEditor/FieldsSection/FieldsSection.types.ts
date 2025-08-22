import type { IStyle, IStyleFunctionOrObject, ITheme, ICommandBarStyles, IDetailsListStyles } from '@fluentui/react';
import { ITableSchema, ITableField } from '../../../../../api/model/ITableSchema';

export interface IFieldsSectionProps {
  theme?: ITheme;
  selectedTable: ITableSchema | null;
  editingField: ITableField | null;
  onFieldSelect: (field: ITableField | null) => void;
  onAddField: () => void;
  onEditField: () => void;
  onDeleteField: () => void;
  styles?: IStyleFunctionOrObject<IFieldsSectionStyleProps, IFieldsSectionStyles>;
}

export type IFieldsSectionStyleProps = Pick<IFieldsSectionProps, 'theme'>;

export interface IFieldsSectionStyles {
  root: IStyle;
  sectionTitle: IStyle;
  commandBar: Partial<ICommandBarStyles>;
  fieldsList: Partial<IDetailsListStyles>;
}
