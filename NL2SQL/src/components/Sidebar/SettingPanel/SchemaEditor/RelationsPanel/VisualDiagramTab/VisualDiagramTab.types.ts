import { IStyle, ITheme } from '@fluentui/react';
import { Node, Edge } from 'reactflow';
import { ITableSchema } from '../../../../../../api/model/ITableSchema';
import { ITableRelationDisplay } from '../RelationsPanel.types';

export interface IVisualDiagramTabProps {
    theme?: ITheme;
    selectedTable: ITableSchema | null;
    existingRelations: ITableRelationDisplay[];
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
}

export type IVisualDiagramTabStyleProps = Pick<IVisualDiagramTabProps, 'theme'>;

export interface IVisualDiagramTabStyles {
    container: IStyle;
    content: IStyle;
    noDataContainer: IStyle;
    noDataText: IStyle;
    reactFlowContainer: IStyle;
}
