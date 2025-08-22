import React from 'react';
import {
    Stack,
    Text,
} from '@fluentui/react';
import {
    ReactFlow,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
} from 'reactflow';
import { IVisualDiagramTabProps } from './VisualDiagramTab.types';
import { getClassNames, getStyles } from './VisualDiagramTab.styles';
import strings from '../../../../../../Ioc/en-us';

export const VisualDiagramTab: React.FC<IVisualDiagramTabProps> = ({
    theme,
    selectedTable,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
}) => {
    const classNames = getClassNames(getStyles, { theme });

    const hasNoData = !selectedTable || nodes.length === 0;

    if (hasNoData) {
        return (
            <Stack className={classNames.container}>
                <Stack className={classNames.content}>
                    <Stack className={classNames.noDataContainer}>
                        <Text className={classNames.noDataText}>
                            {!selectedTable 
                                ? strings.SettingsPanel.relations.selectTableForDiagram
                                : strings.SettingsPanel.relations.noRelationsFoundForDiagram
                            }
                        </Text>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack className={classNames.container}>
            <Stack className={classNames.content}>
                <Stack className={classNames.reactFlowContainer}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        fitViewOptions={{
                            padding: 0.2,
                            includeHiddenNodes: false,
                        }}
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </Stack>
            </Stack>
        </Stack>
    );
};
