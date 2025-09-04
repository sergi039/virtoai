import { ITheme, IStyleFunctionOrObject, IDropdownOption, IStyle } from '@fluentui/react';
import { RelationType } from '../../../../../../api/constants/relationType';
import { JoinType } from '../../../../../../api/constants/joinType';
import { CascadeType } from '../../../../../../api/constants/cascadeType';

export interface ICreateRelationTabProps {
    theme?: ITheme;
    styles?: IStyleFunctionOrObject<ICreateRelationTabStyleProps, ICreateRelationTabStyles>;
    isLoading: boolean;
    relationAlreadyExists: boolean;
    serviceOptions: IDropdownOption[];
    sourceServiceId: number | null;
    sourceTableOptions: IDropdownOption[];
    sourceTableName: string;
    sourceColumnOptions: IDropdownOption[];
    sourceColumnName: string;
    targetServiceId: number | null;
    targetTableOptions: IDropdownOption[];
    targetTableName: string;
    targetColumnOptions: IDropdownOption[];
    targetColumnName: string;
    relationTypeOptions: IDropdownOption[];
    relationType: RelationType;
    joinTypeOptions: IDropdownOption[];
    joinType: JoinType;
    cascadeOptions: IDropdownOption[];
    onUpdateAction: CascadeType;
    onDeleteAction: CascadeType;
    isFormValid: boolean;
    selectedTable: { name: string } | null;
    isRequiredJoin: boolean;
    onSourceServiceChange: (serviceId: number | null) => void;
    onSourceTableChange: (tableName: string) => void;
    onSourceColumnChange: (columnName: string) => void;
    onTargetServiceChange: (serviceId: number | null) => void;
    onTargetTableChange: (tableName: string) => void;
    onTargetColumnChange: (columnName: string) => void;
    onRelationTypeChange: (relationType: RelationType) => void;
    onJoinTypeChange: (joinType: JoinType) => void;
    onUpdateActionChange: (action: CascadeType) => void;
    onDeleteActionChange: (action: CascadeType) => void;
    onRequiredJoinChange: (isRequired: boolean) => void;
    onCreateExplicitRelation: () => void;
    onCreateImplicitRelation: () => void;
    onCancel: () => void;
}

export type ICreateRelationTabStyleProps = Pick<ICreateRelationTabProps, 'theme'>;

export interface ICreateRelationTabStyles {
    container: IStyle;
    content: IStyle;
    formGrid: IStyle;
    footer: IStyle;
    warningMessage: IStyle;
}
