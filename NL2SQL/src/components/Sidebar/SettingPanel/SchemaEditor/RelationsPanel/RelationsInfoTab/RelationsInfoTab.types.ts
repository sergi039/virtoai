import { ITheme, IStyleFunctionOrObject, IStyle } from '@fluentui/react';
import { ITableRelationDisplay } from '../RelationsPanel.types';
import { IServiceTableImplicitRelation, IServiceRegistry } from '../../../../../../api/model';

export interface IRelationsInfoTabProps {
    theme?: ITheme;
    styles?: IStyleFunctionOrObject<IRelationsInfoTabStyleProps, IRelationsInfoTabStyles>;
    selectedTable: { name: string } | null;
    existingExplicitRelations: ITableRelationDisplay[];
    existingImplicitRelations: IServiceTableImplicitRelation[];
    serviceRegistrations: IServiceRegistry[];
    onDeleteExplicitRelation: (relationId: string) => void;
    onDeleteImplicitRelation: (relationId: number) => void;
    getRelationTypeName: (relationType: any) => string;
}

export type IRelationsInfoTabStyleProps = Pick<IRelationsInfoTabProps, 'theme'>;

export interface IRelationsInfoTabStyles {
    container: IStyle;
    header: IStyle;
    content: IStyle;
    noRelationsText: IStyle;
    relationsList: IStyle;
}
