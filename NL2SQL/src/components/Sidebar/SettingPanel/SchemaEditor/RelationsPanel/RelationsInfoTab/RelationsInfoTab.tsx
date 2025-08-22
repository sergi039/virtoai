import React from 'react';
import {
    Text,
    DetailsList,
    IColumn,
    SelectionMode,
    IconButton,
    styled,
    Stack,
} from '@fluentui/react';
import {
    IRelationsInfoTabProps,
    IRelationsInfoTabStyleProps,
    IRelationsInfoTabStyles,
} from './RelationsInfoTab.types';
import { getClassNames, getStyles } from './RelationsInfoTab.styles';
import { ITableRelationDisplay } from '../RelationsPanel.types';
import { IServiceTableImplicitRelation } from '../../../../../../api/model';
import strings from '../../../../../../Ioc/en-us';

const RelationsInfoTabBase: React.FC<IRelationsInfoTabProps> = ({
    theme,
    existingExplicitRelations,
    existingImplicitRelations,
    serviceRegistrations,
    onDeleteImplicitRelation,
    onDeleteExplicitRelation,
    getRelationTypeName,
}) => {
    const classNames = getClassNames(getStyles,{theme});

    const getTableNameById = (serviceTableId: number): string => {
        for (const service of serviceRegistrations) {
            const table = service.serviceTables.find(st => st.id === serviceTableId);
            if (table) {
                return table.name;
            }
        }
        return 'Unknown Table';
    };

    const getServiceNameById = (serviceTableId: number): string => {
        for (const service of serviceRegistrations) {
            const table = service.serviceTables.find(st => st.id === serviceTableId);
            if (table) {
                return service.name;
            }
        }
        return 'Unknown Service';
    };

    const explicitRelationColumns: IColumn[] = [
        {
            key: 'sourceTable',
            name: strings.SettingsPanel.relations.sourceTable,
            fieldName: 'sourceTableName',
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
        },
        {
            key: 'targetService',
            name: strings.SettingsPanel.relations.targetService,
            fieldName: 'targetServiceName',
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
        },
        {
            key: 'targetTable',
            name: strings.SettingsPanel.relations.targetTable,
            fieldName: 'targetTableName',
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
        },
        {
            key: 'relation',
            name: strings.SettingsPanel.relations.relationInfo,
            minWidth: 150,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: ITableRelationDisplay) => (
                <Text>
                    {item.sourceColumnName} → {item.targetColumnName}
                    <br />
                    <small>({getRelationTypeName(item.relationType)})</small>
                </Text>
            ),
        },
        {
            key: 'actions',
            name: strings.SettingsPanel.relations.actions,
            minWidth: 60,
            maxWidth: 80,
            onRender: (item: ITableRelationDisplay) => (
                <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title={strings.SettingsPanel.relations.deleteRelation}
                    onClick={() => onDeleteExplicitRelation(item.id || '')}
                />
            ),
        },
    ];

    const implicitRelationColumns: IColumn[] = [
        {
            key: 'sourceTable',
            name: strings.SettingsPanel.relations.sourceTable,
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IServiceTableImplicitRelation) => (
                <Text>{getTableNameById(item.serviceTableId)}</Text>
            ),
        },
        {
            key: 'targetService',
            name: strings.SettingsPanel.relations.targetService,
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IServiceTableImplicitRelation) => (
                <Text>{getServiceNameById(item.relatedServiceTableId)}</Text>
            ),
        },
        {
            key: 'targetTable',
            name: strings.SettingsPanel.relations.targetTable,
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IServiceTableImplicitRelation) => (
                <Text>{getTableNameById(item.relatedServiceTableId)}</Text>
            ),
        },
        {
            key: 'relation',
            name: strings.SettingsPanel.relations.relationInfo,
            minWidth: 150,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: IServiceTableImplicitRelation) => (
                <Text>
                    {item.primaryTableColumn} → {item.relatedTableColumn}
                </Text>
            ),
        },
        {
            key: 'actions',
            name: strings.SettingsPanel.relations.actions,
            minWidth: 60,
            maxWidth: 80,
            onRender: (item: IServiceTableImplicitRelation) => (
                <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title={strings.SettingsPanel.relations.deleteRelation}
                    onClick={() => onDeleteImplicitRelation(item.id)}
                />
            ),
        },
    ];

    return (
        <Stack className={classNames.container}>
            <Stack className={classNames.content} tokens={{ childrenGap: 20 }}>
                <Stack tokens={{ childrenGap: 10 }}>
                    <Text variant="large" block>
                        {strings.SettingsPanel.relations.explicitRelations}
                    </Text>
                    {existingExplicitRelations.length === 0 ? (
                        <Text className={classNames.noRelationsText}>
                            {strings.SettingsPanel.relations.noExplicitRelationsFound}
                        </Text>
                    ) : (
                        <DetailsList
                            className={classNames.relationsList}
                            items={existingExplicitRelations}
                            columns={explicitRelationColumns}
                            selectionMode={SelectionMode.none}
                            isHeaderVisible={true}
                        />
                    )}
                </Stack>

                <Stack tokens={{ childrenGap: 10 }}>
                    <Text variant="large" block>
                        {strings.SettingsPanel.relations.implicitRelations}
                    </Text>
                    {existingImplicitRelations.length === 0 ? (
                        <Text className={classNames.noRelationsText}>
                            {strings.SettingsPanel.relations.noImplicitRelationsFound}
                        </Text>
                    ) : (
                        <DetailsList
                            className={classNames.relationsList}
                            items={existingImplicitRelations}
                            columns={implicitRelationColumns}
                            selectionMode={SelectionMode.none}
                            isHeaderVisible={true}
                        />
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};

export const RelationsInfoTab = styled<IRelationsInfoTabProps, IRelationsInfoTabStyleProps, IRelationsInfoTabStyles>(
    RelationsInfoTabBase,
    getStyles,
    undefined,
    { scope: 'RelationsInfoTab' }
);
