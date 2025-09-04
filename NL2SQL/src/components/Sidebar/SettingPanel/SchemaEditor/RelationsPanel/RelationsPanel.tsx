import React, { useState, useEffect, useMemo } from 'react';
import {
    Panel,
    PanelType,
    MessageBar,
    MessageBarType,
    styled,
    Pivot,
    PivotItem,
    IDropdownOption,
} from '@fluentui/react';
import {
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    IRelationsPanelProps,
    IRelationsPanelStyleProps,
    IRelationsPanelStyles,
    ITableRelation,
    ITableRelationDisplay,
} from './RelationsPanel.types';
import { getStyles } from './RelationsPanel.styles';
import { IForeignKey } from '../../../../../api/model/ITableSchema';
import strings from '../../../../../Ioc/en-us';
import { PostgreSQLGenerator } from '../../../../../utils/postgreSQLGenerator';
import { SqlRuleGenerator } from '../../../../../utils/sqlRuleGenerator';
import { useNL2SQLStore } from '../../../../../stores/useNL2SQLStore';
import { RelationType } from '../../../../../api/constants/relationType';
import { JoinType } from '../../../../../api/constants/joinType';
import { CascadeType, getCascadeDisplayName } from '../../../../../api/constants/cascadeType';
import { RelationsInfoTab } from './RelationsInfoTab';
import { CreateRelationTab } from './CreateRelationTab';
import { VisualDiagramTab } from './VisualDiagramTab';
import { IServiceTableImplicitRelation } from '../../../../../api/model';

const RelationsPanelBase: React.FC<IRelationsPanelProps> = ({
    theme,
    isOpen,
    selectedService,
    serviceRegistrations,
    selectedTable,
    allTables,
    onDismiss,
    onRelationChanged,
}) => {
    const { executeSql, setServiceRegistrations, getTablesByServiceId,
        addRule, deleteRule, getAllRules, getDatabaseSchemaForEditor, databaseSchema,
        createImplicitRelation, deleteImplicitRelation
    } = useNL2SQLStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: MessageBarType } | null>(null);
    const [activeTab, setActiveTab] = useState<string>('info');
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [sourceServiceId, setSourceServiceId] = useState<number | null>(null);
    const [sourceTableName, setSourceTableName] = useState<string>('');
    const [sourceColumnName, setSourceColumnName] = useState<string>('');
    const [targetServiceId, setTargetServiceId] = useState<number | null>(null);
    const [targetTableName, setTargetTableName] = useState<string>('');
    const [targetColumnName, setTargetColumnName] = useState<string>('');
    const [relationType, setRelationType] = useState<RelationType>(RelationType.OneToMany);
    const [joinType, setJoinType] = useState<JoinType>(JoinType.LEFT);
    const [onUpdateAction, setOnUpdateAction] = useState<CascadeType>(CascadeType.NONE);
    const [onDeleteAction, setOnDeleteAction] = useState<CascadeType>(CascadeType.NONE);
    const [isRequiredJoin, setIsRequiredJoin] = useState<boolean>(true);
    const [existingRelations, setExistingRelations] = useState<ITableRelationDisplay[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (selectedService) {
                const service = serviceRegistrations.find(s =>
                    s.name.toLowerCase() === selectedService.toLowerCase()
                );

                if (service) {
                    setSourceServiceId(service.id);
                }
            } else {
                setSourceServiceId(null);
            }

            if (selectedTable) {
                setSourceTableName(selectedTable.name);
            } else {
                setSourceTableName('');
            }

            setSourceColumnName('');
            setTargetServiceId(null);
            setTargetTableName('');
            setTargetColumnName('');
            setRelationType(RelationType.OneToMany);
            setJoinType(JoinType.LEFT);
            setOnUpdateAction(CascadeType.NONE);
            setOnDeleteAction(CascadeType.NONE);
            setIsRequiredJoin(true);
            setMessage(null);
            (async () => {
                await loadExistingRelations();
            })();
        }
    }, [isOpen, selectedService, selectedTable, serviceRegistrations]);

    useEffect(() => {
        if (message) {
            const timeout = message.type === MessageBarType.error ? 8000 : 6000;
            const timer = setTimeout(() => setMessage(null), timeout);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (sourceTableName) {
            (async () => {
                await loadExistingRelations();
            })();
        } else {
            setExistingRelations([]);
            setNodes([]);
            setEdges([]);
        }
    }, [sourceTableName, allTables, serviceRegistrations, databaseSchema]);

    const loadExistingRelations = async (forceRefresh = false) => {
        if (!sourceTableName) {
            setExistingRelations([]);
            setNodes([]);
            setEdges([]);
            return;
        }

        let currentTables;

        if (forceRefresh) {
            try {
                const freshSchema = await getDatabaseSchemaForEditor();
                currentTables = freshSchema.tables || allTables;
            } catch (error) {
                currentTables = databaseSchema?.tables || allTables;
            }
        } else {
            currentTables = databaseSchema?.tables || allTables;
        }

        const sourceTable = currentTables.find((table: any) => table.name === sourceTableName);
        if (!sourceTable) {
            setExistingRelations([]);
            setNodes([]);
            setEdges([]);
            return;
        }


        const getTableNameById = (tableId: number): string => {
            for (const service of serviceRegistrations) {
                const table = service.serviceTables.find(t => t.id === tableId);
                if (table) return table.name;
            }
            return 'Unknown Table';
        };

        const relations: ITableRelationDisplay[] = [];

        if (sourceTable.foreignKeys) {
            sourceTable.foreignKeys.forEach((fk: IForeignKey, index: number) => {
                const sourceService = serviceRegistrations.find(s =>
                    s.serviceTables.some(t => t.name === fk.sourceTable)
                );
                const targetService = serviceRegistrations.find(s =>
                    s.serviceTables.some(t => t.name === fk.targetTable)
                );

                let relationType = RelationType.OneToMany;

                if (fk.sourceTable.includes('_junction') || fk.targetTable.includes('_junction')) {
                    relationType = RelationType.ManyToMany;
                } else {
                    const sourceTableSchema = currentTables.find((t: any) => t.name === fk.sourceTable);
                    const sourceField = sourceTableSchema?.fields.find((f: any) => f.name === fk.sourceColumn);
                    if (sourceField?.isUnique || sourceField?.isPrimaryKey) {
                        relationType = RelationType.OneToOne;
                    }
                }

                relations.push({
                    id: `explicit_${fk.constraintName}_${index}`,
                    sourceServiceId: sourceService?.id || 0,
                    sourceTableName: fk.sourceTable,
                    sourceColumnName: fk.sourceColumn,
                    targetServiceId: targetService?.id || 0,
                    targetTableName: fk.targetTable,
                    targetColumnName: fk.targetColumn,
                    relationType,
                    constraintName: fk.constraintName,
                    sourceServiceName: sourceService?.name || 'Unknown',
                    targetServiceName: targetService?.name || 'Unknown',
                    junctionTableName: relationType === RelationType.ManyToMany ?
                        (fk.sourceTable.includes('_junction') ? fk.sourceTable : fk.targetTable) : undefined
                });
            });
        }

        if (sourceTable.implicitRelations && sourceTable.implicitRelations.length > 0) {
            sourceTable.implicitRelations.forEach((implicitRel: IServiceTableImplicitRelation) => {
                const sourceTableName = getTableNameById(implicitRel.serviceTableId);
                const targetTableName = getTableNameById(implicitRel.relatedServiceTableId);
                
                const sourceService = serviceRegistrations.find(s =>
                    s.serviceTables.some(t => t.id === implicitRel.serviceTableId)
                );
                const targetService = serviceRegistrations.find(s =>
                    s.serviceTables.some(t => t.id === implicitRel.relatedServiceTableId)
                );

                relations.push({
                    id: `implicit_${implicitRel.id}`,
                    sourceServiceId: sourceService?.id || 0,
                    sourceTableName: sourceTableName,
                    sourceColumnName: implicitRel.primaryTableColumn,
                    targetServiceId: targetService?.id || 0,
                    targetTableName: targetTableName,
                    targetColumnName: implicitRel.relatedTableColumn,
                    relationType: implicitRel.RelationType as RelationType,
                    sourceServiceName: sourceService?.name || 'Unknown',
                    targetServiceName: targetService?.name || 'Unknown',
                });
            });
        }

        setExistingRelations(relations);

        if (selectedTable && relations.length > 0) {
            generateFlowDiagram(relations);
        } else {
            setNodes([]);
            setEdges([]);
        }
    };

    const serviceOptions: IDropdownOption[] = useMemo(() => {
        return serviceRegistrations.map(service => ({
            key: service.id,
            text: service.name,
        }));
    }, [serviceRegistrations]);

    const sourceTableOptions: IDropdownOption[] = useMemo(() => {
        if (!sourceServiceId) return [];

        const service = serviceRegistrations.find(s => s.id === sourceServiceId);
        if (!service) return [];

        return service.serviceTables.map(table => ({
            key: table.name,
            text: table.name,
        }));
    }, [sourceServiceId, serviceRegistrations]);

    const sourceColumnOptions: IDropdownOption[] = useMemo(() => {
        if (!sourceTableName) return [];

        const table = allTables.find(t => t.name === sourceTableName);
        if (!table) return [];

        return table.fields.map(field => ({
            key: field.name,
            text: `${field.name} (${field.type})`,
        }));
    }, [sourceTableName, allTables]);

    const targetTableOptions: IDropdownOption[] = useMemo(() => {
        if (!targetServiceId) return [];

        const service = serviceRegistrations.find(s => s.id === targetServiceId);
        if (!service) return [];

        return service.serviceTables
            .filter(table => table.name !== sourceTableName)
            .map(table => ({
                key: table.name,
                text: table.name,
            }));
    }, [targetServiceId, sourceTableName, serviceRegistrations]);

    const targetColumnOptions: IDropdownOption[] = useMemo(() => {
        if (!targetTableName) return [];

        const table = allTables.find(t => t.name === targetTableName);
        if (!table) return [];

        return table.fields.map(field => ({
            key: field.name,
            text: `${field.name} (${field.type})`,
        }));
    }, [targetTableName, allTables]);

    const relationTypeOptions: IDropdownOption[] = [
        { key: RelationType.OneToOne, text: strings.SettingsPanel.relations.oneToOne },
        { key: RelationType.OneToMany, text: strings.SettingsPanel.relations.oneToMany },
        { key: RelationType.ManyToMany, text: strings.SettingsPanel.relations.manyToMany },
    ];

    const joinTypeOptions: IDropdownOption[] = [
        { key: JoinType.LEFT, text: strings.SettingsPanel.relations.leftJoin },
        { key: JoinType.RIGHT, text: strings.SettingsPanel.relations.rightJoin },
        { key: JoinType.INNER, text: strings.SettingsPanel.relations.innerJoin },
        { key: JoinType.FULL, text: strings.SettingsPanel.relations.fullJoin },
        { key: JoinType.CROSS, text: strings.SettingsPanel.relations.crossJoin },
    ];

    const cascadeOptions: IDropdownOption[] = [
        { key: CascadeType.NONE, text: getCascadeDisplayName(CascadeType.NONE) },
        { key: CascadeType.CASCADE, text: getCascadeDisplayName(CascadeType.CASCADE) },
        { key: CascadeType.RESTRICT, text: getCascadeDisplayName(CascadeType.RESTRICT) },
        { key: CascadeType.SET_NULL, text: getCascadeDisplayName(CascadeType.SET_NULL) },
        { key: CascadeType.SET_DEFAULT, text: getCascadeDisplayName(CascadeType.SET_DEFAULT) },
    ];

    const handleCreateImplicitRelation = async () => {
        if (!sourceServiceId || !sourceTableName || !sourceColumnName ||
            !targetServiceId || !targetTableName || !targetColumnName) {
            setMessage({
                text: strings.SettingsPanel.relations.fillAllFields,
                type: MessageBarType.error
            });
            return;
        }

        if (relationAlreadyExists) {
            setMessage({
                text: strings.SettingsPanel.relations.relationAlreadyExists,
                type: MessageBarType.error
            });
            return;
        }

        setIsLoading(true);
        try {
            let createdRuleId = 0;
            const sourceService = serviceRegistrations.find(s => s.id === sourceServiceId);

            if (sourceService) {
                const sourceServiceTable = sourceService.serviceTables.find(st => st.name === sourceTableName);
                if (sourceServiceTable) {
                    const sqlRule = SqlRuleGenerator.generateJoinRule({
                        sourceTableName,
                        targetTableName,
                        sourceColumnName,
                        targetColumnName,
                        joinType,
                        serviceTableId: sourceServiceTable.id,
                        relationType,
                        isRequiredJoin
                    });

                    const resultCreatedRule = await addRule(sqlRule);
                    createdRuleId = resultCreatedRule.id;
                }
            }

            if (createdRuleId == 0) {
                throw new Error(strings.SettingsPanel.relations.ruleCreationError);
            }

            const relationImplicit: IServiceTableImplicitRelation = {
                id: Date.now(),
                serviceTableId: serviceRegistrations.map(s => s.serviceTables).flat().find(t => t.name === sourceTableName)?.id || 0,
                relatedServiceTableId: serviceRegistrations.map(s => s.serviceTables).flat().find(t => t.name === targetTableName)?.id || 0,
                primaryTableColumn: sourceColumnName,
                relatedTableColumn: targetColumnName,
                RelationType: relationType,
                sqlGenerationRuleId: createdRuleId
            }

            await createImplicitRelation(relationImplicit);


            await loadExistingRelations(true);

            if (onRelationChanged) {
                onRelationChanged();
            }

            setTimeout(() => {
                setMessage({
                    text: strings.SettingsPanel.relations.implicitRelationCreatedSuccess.replace('{0}', sourceTableName).replace('{1}', targetTableName),
                    type: MessageBarType.success
                });
            }, 50);

            setSourceColumnName('');
            setTargetServiceId(null);
            setTargetTableName('');
            setTargetColumnName('');
            setRelationType(RelationType.OneToMany);
            setJoinType(JoinType.LEFT);
            setIsRequiredJoin(true);

            setActiveTab('info');

        } catch (error) {
            setMessage({
                text: strings.SettingsPanel.relations.implicitRelationCreationError.replace('{0}', error instanceof Error ? error.message : 'Unknown error'),
                type: MessageBarType.error
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateExplicitRelation = async () => {
        if (!sourceServiceId || !sourceTableName || !sourceColumnName ||
            !targetServiceId || !targetTableName || !targetColumnName) {
            setMessage({
                text: strings.SettingsPanel.relations.fillAllFields,
                type: MessageBarType.error
            });
            return;
        }

        if (relationAlreadyExists) {
            setMessage({
                text: strings.SettingsPanel.relations.relationAlreadyExists,
                type: MessageBarType.error
            });
            return;
        }

        setIsLoading(true);
        try {
            const relation: ITableRelation = {
                sourceServiceId,
                sourceTableName,
                sourceColumnName,
                targetServiceId,
                targetTableName,
                targetColumnName,
                relationType,
                joinType,
                constraintName: `fk_${sourceTableName}_${targetTableName}_${Date.now()}`,
                onUpdateAction,
                onDeleteAction,
            };

            if (relationType === RelationType.ManyToMany) {
                relation.junctionTableName = `${sourceTableName}_${targetTableName}_junction`;
                const operations = PostgreSQLGenerator.generateManyToManyRelationSQL(relation);

                for (const operation of operations) {
                    const result = await executeSql(operation.sql);
                    if (!result.isSuccess) {
                        throw new Error(`Failed to execute: ${operation.description}`);
                    }
                }

                await executeSql(`INSERT INTO public.service_table (name, service_registry_id) VALUES ('${relation.junctionTableName}', ${sourceServiceId})`);

                const sourceService = serviceRegistrations.find(s => s.id === sourceServiceId);
                if (sourceService) {
                    const sourceServiceTable = sourceService.serviceTables.find(st => st.name === sourceTableName);
                    if (sourceServiceTable) {
                        const sqlRule = SqlRuleGenerator.generateJoinRule({
                            sourceTableName,
                            targetTableName,
                            sourceColumnName,
                            targetColumnName,
                            joinType,
                            serviceTableId: sourceServiceTable.id,
                            relationType,
                            junctionTableName: relation.junctionTableName,
                            isRequiredJoin
                        });

                        await addRule(sqlRule);
                    }
                }

                const targetService = serviceRegistrations.find(s => s.id === targetServiceId);
                if (targetService && targetServiceId !== sourceServiceId) {
                    const targetServiceTable = targetService.serviceTables.find(st => st.name === targetTableName);
                    if (targetServiceTable) {
                        const reverseSqlRule = SqlRuleGenerator.generateJoinRule({
                            sourceTableName: targetTableName,
                            targetTableName: sourceTableName,
                            sourceColumnName: targetColumnName,
                            targetColumnName: sourceColumnName,
                            joinType,
                            serviceTableId: targetServiceTable.id,
                            relationType,
                            junctionTableName: relation.junctionTableName,
                            isRequiredJoin
                        });

                        await addRule(reverseSqlRule);
                    }
                }

            } else {
                const sqlOperation = PostgreSQLGenerator.generateCreateForeignKeySQL(relation);
                const result = await executeSql(sqlOperation.sql);
                if (!result.isSuccess) {
                    throw new Error(result.errorMessage || 'Failed to create relation');
                }

                const sourceService = serviceRegistrations.find(s => s.id === sourceServiceId);
                if (sourceService) {
                    const sourceServiceTable = sourceService.serviceTables.find(st => st.name === sourceTableName);
                    if (sourceServiceTable) {
                        const sqlRule = SqlRuleGenerator.generateJoinRule({
                            sourceTableName,
                            targetTableName,
                            sourceColumnName,
                            targetColumnName,
                            joinType,
                            serviceTableId: sourceServiceTable.id,
                            relationType,
                            isRequiredJoin
                        });

                        await addRule(sqlRule);
                    }
                }
            }

            const sourceService = serviceRegistrations.find(s => s.id === sourceServiceId);
            if (sourceService) {
                const tables = await getTablesByServiceId(sourceServiceId);
                const updatedSourceService = {
                    ...sourceService,
                    serviceTables: tables
                };

                let updatedServiceRegistrations = serviceRegistrations.map((s) =>
                    s.id === sourceServiceId ? updatedSourceService : s
                );

                if (targetServiceId !== sourceServiceId) {
                    const targetService = serviceRegistrations.find(s => s.id === targetServiceId);
                    if (targetService) {
                        const targetTables = await getTablesByServiceId(targetServiceId);
                        const updatedTargetService = {
                            ...targetService,
                            serviceTables: targetTables
                        };

                        updatedServiceRegistrations = updatedServiceRegistrations.map((s) =>
                            s.id === targetServiceId ? updatedTargetService : s
                        );
                    }
                }

                setServiceRegistrations(updatedServiceRegistrations);
            }

            await loadExistingRelations(true);

            if (onRelationChanged) {
                onRelationChanged();
            }

            setTimeout(() => {
                setMessage({
                    text: strings.SettingsPanel.relations.relationCreatedSuccess.replace('{0}', sourceTableName).replace('{1}', targetTableName),
                    type: MessageBarType.success
                });
            }, 100);

            setSourceColumnName('');
            setTargetServiceId(null);
            setTargetTableName('');
            setTargetColumnName('');
            setJoinType(JoinType.LEFT);
            setOnUpdateAction(CascadeType.NONE);
            setOnDeleteAction(CascadeType.NONE);
            setIsRequiredJoin(true);

            setActiveTab('info');
        } catch (error) {
            setMessage({
                text: strings.SettingsPanel.relations.relationCreationError.replace('{0}', error instanceof Error ? error.message : 'Unknown error'),
                type: MessageBarType.error
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImplicitRelation = async (relationId: number) => {
        const relationToDelete = selectedTable?.implicitRelations?.find(r => r.id === relationId);

        if (!relationToDelete) {
            setMessage({
                text: strings.SettingsPanel.relations.relationNotFound,
                type: MessageBarType.error
            });
            return;
        }

        setIsLoading(true);

        try {
            await deleteRule(relationToDelete.sqlGenerationRuleId);
            await deleteImplicitRelation(relationToDelete.id);

            await loadExistingRelations(true);

            if (onRelationChanged) {
                onRelationChanged();
            }

            setTimeout(() => {
                setMessage({
                    text: strings.SettingsPanel.relations.implicitRelationDeletedSuccess.replace('{0}', relationToDelete.primaryTableColumn).replace('{1}', relationToDelete.relatedTableColumn),
                    type: MessageBarType.success
                });
            }, 50);
        }
        catch (error) {
            setMessage({
                text: strings.SettingsPanel.relations.implicitRelationDeletionError.replace('{0}', error instanceof Error ? error.message : 'Unknown error'),
                type: MessageBarType.error
            });
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleDeleteExplicitRelation = async (relationId: string) => {
        try {
            setIsLoading(true);

            const relationToDelete = existingRelations.find(r => r.id === relationId);
            if (!relationToDelete) {
                return;
            }

            if (relationToDelete.relationType === RelationType.ManyToMany) {
                const dropOperation = PostgreSQLGenerator.generateDropManyToManyRelationSQL(relationToDelete);
                const result = await executeSql(dropOperation.sql);
                if (!result.isSuccess) {
                    throw new Error(result.errorMessage || 'Failed to delete many-to-many relation');
                }
            } else {
                const dropSQL = PostgreSQLGenerator.generateDropForeignKeySQL(
                    relationToDelete.sourceTableName,
                    relationToDelete.constraintName || `fk_${relationToDelete.sourceTableName}_${relationToDelete.targetTableName}`
                );

                const result = await executeSql(dropSQL.sql);
                if (!result.isSuccess) {
                    throw new Error(result.errorMessage || 'Failed to delete relation');
                }
            }

            const sourceService = serviceRegistrations.find(s => s.id === relationToDelete.sourceServiceId);
            if (sourceService) {
                const tables = await getTablesByServiceId(relationToDelete.sourceServiceId);
                const updatedSourceService = {
                    ...sourceService,
                    serviceTables: tables
                };

                const updatedServiceRegistrations = serviceRegistrations.map((s) =>
                    s.id === relationToDelete.sourceServiceId ? updatedSourceService : s
                );

                setServiceRegistrations(updatedServiceRegistrations);
            }

            const allRules = await getAllRules();
            const rulesToDelete = allRules.filter(rule => {
                if (!rule.serviceTableId) return false;

                if (relationToDelete.relationType === RelationType.ManyToMany && relationToDelete.junctionTableName) {
                    const hasJunctionTable = rule.text.includes(relationToDelete.junctionTableName);

                    const manyToManyPattern = rule.text.includes(`JOIN ${relationToDelete.junctionTableName} ON ${relationToDelete.sourceTableName}.${relationToDelete.sourceColumnName} = ${relationToDelete.junctionTableName}.${relationToDelete.sourceColumnName}`) &&
                        rule.text.includes(`JOIN ${relationToDelete.targetTableName} ON ${relationToDelete.junctionTableName}.${relationToDelete.targetColumnName} = ${relationToDelete.targetTableName}.${relationToDelete.targetColumnName}`);

                    const reverseManyToManyPattern = rule.text.includes(`JOIN ${relationToDelete.junctionTableName} ON ${relationToDelete.targetTableName}.${relationToDelete.targetColumnName} = ${relationToDelete.junctionTableName}.${relationToDelete.targetColumnName}`) &&
                        rule.text.includes(`JOIN ${relationToDelete.sourceTableName} ON ${relationToDelete.junctionTableName}.${relationToDelete.sourceColumnName} = ${relationToDelete.sourceTableName}.${relationToDelete.sourceColumnName}`);

                    const optionalManyToManyPattern = rule.text.includes(`Only trigger an automatic`) && 
                        rule.text.includes(`JOIN between ${relationToDelete.sourceTableName} and ${relationToDelete.targetTableName} through ${relationToDelete.junctionTableName}`);

                    const reverseOptionalManyToManyPattern = rule.text.includes(`Only trigger an automatic`) && 
                        rule.text.includes(`JOIN between ${relationToDelete.targetTableName} and ${relationToDelete.sourceTableName} through ${relationToDelete.junctionTableName}`);

                    return hasJunctionTable || manyToManyPattern || reverseManyToManyPattern || optionalManyToManyPattern || reverseOptionalManyToManyPattern;
                } else {
                    const mainRulePattern = rule.text.includes(`JOIN ${relationToDelete.targetTableName} with ${relationToDelete.sourceTableName} their link ${relationToDelete.targetTableName}.${relationToDelete.targetColumnName} = ${relationToDelete.sourceTableName}.${relationToDelete.sourceColumnName}`);

                    const reverseRulePattern = rule.text.includes(`JOIN ${relationToDelete.sourceTableName} with ${relationToDelete.targetTableName} their link ${relationToDelete.sourceTableName}.${relationToDelete.sourceColumnName} = ${relationToDelete.targetTableName}.${relationToDelete.targetColumnName}`);

                    const isFromSourceTable = rule.text.includes(`when selecting from ${relationToDelete.sourceTableName}`);
                    const isFromTargetTable = rule.text.includes(`when selecting from ${relationToDelete.targetTableName}`);

                    const optionalMainPattern = rule.text.includes(`Only trigger an automatic`) && 
                        rule.text.includes(`JOIN between ${relationToDelete.sourceTableName} and ${relationToDelete.targetTableName} on ${relationToDelete.sourceTableName}.${relationToDelete.sourceColumnName} = ${relationToDelete.targetTableName}.${relationToDelete.targetColumnName}`);

                    const optionalReversePattern = rule.text.includes(`Only trigger an automatic`) && 
                        rule.text.includes(`JOIN between ${relationToDelete.targetTableName} and ${relationToDelete.sourceTableName} on ${relationToDelete.targetTableName}.${relationToDelete.targetColumnName} = ${relationToDelete.sourceTableName}.${relationToDelete.sourceColumnName}`);

                    const crossJoinPattern = rule.text.includes(`CROSS JOIN ${relationToDelete.targetTableName} with ${relationToDelete.sourceTableName}`);
                    const optionalCrossJoinPattern = rule.text.includes(`Only trigger an automatic CROSS JOIN between ${relationToDelete.sourceTableName} and ${relationToDelete.targetTableName}`);

                    return (mainRulePattern && isFromSourceTable) || 
                           (reverseRulePattern && isFromTargetTable) || 
                           optionalMainPattern || 
                           optionalReversePattern || 
                           crossJoinPattern || 
                           optionalCrossJoinPattern;
                }
            });


            for (const ruleToDelete of rulesToDelete) {
                await deleteRule(ruleToDelete.id);
            }

            const updatedRelations = existingRelations.filter(r => r.id !== relationId);
            setExistingRelations(updatedRelations);

            if (selectedTable && updatedRelations.length > 0) {
                generateFlowDiagram(updatedRelations);
            } else {
                setNodes([]);
                setEdges([]);
            }

            setMessage({
                text: strings.SettingsPanel.relations.relationDeletedSuccess,
                type: MessageBarType.success
            });

            if (onRelationChanged) {
                onRelationChanged();
            }
        } catch (error) {
            setMessage({
                text: strings.SettingsPanel.relations.relationDeletionError.replace('{0}', error instanceof Error ? error.message : 'Unknown error'),
                type: MessageBarType.error
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getServiceNameByTableName = (tableName: string): string => {
        const service = serviceRegistrations.find(s =>
            s.serviceTables.some(t => t.name === tableName)
        );
        return service?.name || 'Unknown Service';
    };

    const getRelationTypeName = (relationType: RelationType | string): string => {
        if (typeof relationType === 'string') {
            return relationType;
        }
        switch (relationType) {
            case RelationType.OneToOne:
                return 'One-to-One';
            case RelationType.OneToMany:
                return 'One-to-Many';
            case RelationType.ManyToMany:
                return 'Many-to-Many';
            default:
                return 'Unknown';
        }
    };

    const generateFlowDiagram = (relations: ITableRelationDisplay[]) => {
        if (!selectedTable) return;

        const centerNode: Node = {
            id: selectedTable.name,
            type: 'default',
            position: { x: 250, y: 200 },
            data: {
                label: (
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                        {selectedTable.name}
                        <br />
                        <small style={{ color: 'white' }}>({getServiceNameByTableName(selectedTable.name)})</small>
                    </div>
                )
            },
            style: {
                background: theme?.palette.themePrimary || '#0078d4',
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                minWidth: '120px',
            },
        };

        const relatedNodes: Node[] = [];
        const relatedEdges: Edge[] = [];

        const uniqueTables = new Set<string>();
        relations.forEach((relation) => {
            if (relation.sourceTableName !== selectedTable.name) {
                uniqueTables.add(relation.sourceTableName);
            }
            if (relation.targetTableName !== selectedTable.name) {
                uniqueTables.add(relation.targetTableName);
            }
        });

        const tableArray = Array.from(uniqueTables);
        const angleStep = (2 * Math.PI) / Math.max(tableArray.length, 1);
        const radius = 180;

        tableArray.forEach((tableName, index) => {
            const angle = index * angleStep;
            const x = 250 + radius * Math.cos(angle);
            const y = 200 + radius * Math.sin(angle);

            relatedNodes.push({
                id: tableName,
                type: 'default',
                position: { x, y },
                data: {
                    label: (
                        <div style={{ textAlign: 'center', fontSize: '12px' }}>
                            {tableName}
                            <br />
                            <small style={{ color: '#666' }}>({getServiceNameByTableName(tableName)})</small>
                        </div>
                    )
                },
                style: {
                    background: theme?.palette.neutralLight || '#f3f2f1',
                    color: theme?.palette.neutralPrimary || '#323130',
                    border: '1px solid #8a8886',
                    borderRadius: '6px',
                    padding: '8px',
                    minWidth: '100px',
                },
            });
        });

        relations.forEach((relation, index) => {
            const sourceId = relation.sourceTableName === selectedTable.name ? selectedTable.name : relation.sourceTableName;
            const targetId = relation.targetTableName === selectedTable.name ? selectedTable.name : relation.targetTableName;

            if (sourceId !== targetId) {
                const isImplicitRelation = relation.id?.startsWith('implicit_');
                
                relatedEdges.push({
                    id: `edge-${index}`,
                    source: sourceId,
                    target: targetId,
                    label: `${relation.sourceColumnName} → ${relation.targetColumnName}`,
                    labelStyle: { 
                        fontSize: '10px', 
                        fontWeight: 'bold',
                        color: isImplicitRelation ? '#ff8c00' : '#000000'
                    },
                    labelBgStyle: { 
                        fill: theme?.palette.white || '#fff', 
                        fillOpacity: 0.8,
                        stroke: isImplicitRelation ? '#ff8c00' : 'transparent',
                        strokeWidth: isImplicitRelation ? 1 : 0
                    },
                    style: { 
                        stroke: isImplicitRelation ? '#ff8c00' : (theme?.palette.themePrimary || '#0078d4'), 
                        strokeWidth: 2,
                        strokeDasharray: isImplicitRelation ? '5,5' : '0'
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: isImplicitRelation ? '#ff8c00' : (theme?.palette.themePrimary || '#0078d4'),
                    },
                });
            }
        });

        setNodes([centerNode, ...relatedNodes]);
        setEdges(relatedEdges);
    };

    const relationAlreadyExists = useMemo(() => {
        if (!sourceTableName || !sourceColumnName || !targetTableName || !targetColumnName) {
            return false;
        }


        const existsInRelations = PostgreSQLGenerator.checkRelationExists(
            sourceTableName,
            sourceColumnName,
            targetTableName,
            targetColumnName,
            existingRelations
        );

        if (existsInRelations) {
            return true;
        }

        if (selectedTable?.implicitRelations) {
            const getTableNameById = (tableId: number): string => {
                for (const service of serviceRegistrations) {
                    const table = service.serviceTables.find(t => t.id === tableId);
                    if (table) return table.name;
                }
                return 'Unknown Table';
            };

            const existsInImplicit = selectedTable.implicitRelations.some((implicitRel: IServiceTableImplicitRelation) => {
                const sourceTableNameFromId = getTableNameById(implicitRel.serviceTableId);
                const targetTableNameFromId = getTableNameById(implicitRel.relatedServiceTableId);
                
                return (
                    (sourceTableNameFromId === sourceTableName && 
                     targetTableNameFromId === targetTableName &&
                     implicitRel.primaryTableColumn === sourceColumnName &&
                     implicitRel.relatedTableColumn === targetColumnName) ||
                    (sourceTableNameFromId === targetTableName && 
                     targetTableNameFromId === sourceTableName &&
                     implicitRel.primaryTableColumn === targetColumnName &&
                     implicitRel.relatedTableColumn === sourceColumnName)
                );
            });

            if (existsInImplicit) {
                return true;
            }
        }

        const currentServiceTable = serviceRegistrations
            .flatMap(service => service.serviceTables)
            .find(table => table.name === sourceTableName);
        
        if (currentServiceTable?.implicitRelationsAsPrimary) {
            const getTableNameById = (tableId: number): string => {
                for (const service of serviceRegistrations) {
                    const table = service.serviceTables.find(t => t.id === tableId);
                    if (table) return table.name;
                }
                return 'Unknown Table';
            };

            const existsInServiceTableImplicit = currentServiceTable.implicitRelationsAsPrimary.some((implicitRel: IServiceTableImplicitRelation) => {
                const sourceTableNameFromId = getTableNameById(implicitRel.serviceTableId);
                const targetTableNameFromId = getTableNameById(implicitRel.relatedServiceTableId);
                
                return (
                    (sourceTableNameFromId === sourceTableName && 
                     targetTableNameFromId === targetTableName &&
                     implicitRel.primaryTableColumn === sourceColumnName &&
                     implicitRel.relatedTableColumn === targetColumnName) ||
                    (sourceTableNameFromId === targetTableName && 
                     targetTableNameFromId === sourceTableName &&
                     implicitRel.primaryTableColumn === targetColumnName &&
                     implicitRel.relatedTableColumn === sourceColumnName)
                );
            });

            if (existsInServiceTableImplicit) {
                return true;
            }
        }

        return false;
    }, [sourceTableName, sourceColumnName, targetTableName, targetColumnName, existingRelations, selectedTable, serviceRegistrations]);

    const isFormValid = Boolean(sourceServiceId && sourceTableName && sourceColumnName &&
        targetServiceId && targetTableName && targetColumnName && !relationAlreadyExists);

    return (
        <Panel
            isOpen={isOpen}
            type={PanelType.largeFixed}
            onDismiss={onDismiss}
            headerText={`${strings.SettingsPanel.relations.title}: ${selectedTable?.name || ''}`}
            closeButtonAriaLabel={strings.SettingsPanel.relations.cancel}
        >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {message && (
                    <MessageBar
                        messageBarType={message.type}
                        onDismiss={() => setMessage(null)}
                        dismissButtonAriaLabel={strings.SettingsPanel.relations.cancel}
                    >
                        {message.text}
                    </MessageBar>
                )}

                <Pivot
                    selectedKey={activeTab}
                    onLinkClick={(item) => setActiveTab(item?.props.itemKey || 'info')}
                    styles={{ root: { marginTop: '20px' } }}
                >
                    <PivotItem
                        headerText={strings.SettingsPanel.relations.relationsInfoTab}
                        itemKey="info"
                    >
                        <RelationsInfoTab
                            theme={theme}
                            selectedTable={selectedTable}
                            existingExplicitRelations={existingRelations}
                            existingImplicitRelations={selectedTable?.implicitRelations || []}
                            serviceRegistrations={serviceRegistrations}
                            onDeleteExplicitRelation={handleDeleteExplicitRelation}
                            onDeleteImplicitRelation={handleDeleteImplicitRelation}
                            getRelationTypeName={getRelationTypeName}
                        />
                    </PivotItem>

                    <PivotItem
                        headerText={strings.SettingsPanel.relations.createRelationTab}
                        itemKey="create"
                    >
                        <CreateRelationTab
                            theme={theme}
                            isLoading={isLoading}
                            relationAlreadyExists={relationAlreadyExists}
                            serviceOptions={serviceOptions}
                            sourceServiceId={sourceServiceId}
                            sourceTableOptions={sourceTableOptions}
                            sourceTableName={sourceTableName}
                            sourceColumnOptions={sourceColumnOptions}
                            sourceColumnName={sourceColumnName}
                            targetServiceId={targetServiceId}
                            targetTableOptions={targetTableOptions}
                            targetTableName={targetTableName}
                            targetColumnOptions={targetColumnOptions}
                            targetColumnName={targetColumnName}
                            relationTypeOptions={relationTypeOptions}
                            relationType={relationType}
                            joinTypeOptions={joinTypeOptions}
                            joinType={joinType}
                            cascadeOptions={cascadeOptions}
                            onUpdateAction={onUpdateAction}
                            onDeleteAction={onDeleteAction}
                            isFormValid={isFormValid}
                            selectedTable={selectedTable}
                            isRequiredJoin={isRequiredJoin}
                            onSourceServiceChange={(serviceId) => {
                                setSourceServiceId(serviceId);
                                setSourceTableName('');
                                setSourceColumnName('');
                            }}
                            onSourceTableChange={(tableName) => {
                                setSourceTableName(tableName);
                                setSourceColumnName('');
                            }}
                            onSourceColumnChange={setSourceColumnName}
                            onTargetServiceChange={(serviceId) => {
                                setTargetServiceId(serviceId);
                                setTargetTableName('');
                                setTargetColumnName('');
                            }}
                            onTargetTableChange={(tableName) => {
                                setTargetTableName(tableName);
                                setTargetColumnName('');
                            }}
                            onTargetColumnChange={setTargetColumnName}
                            onRelationTypeChange={setRelationType}
                            onJoinTypeChange={setJoinType}
                            onUpdateActionChange={setOnUpdateAction}
                            onDeleteActionChange={setOnDeleteAction}
                            onRequiredJoinChange={setIsRequiredJoin}
                            onCreateExplicitRelation={handleCreateExplicitRelation}
                            onCreateImplicitRelation={handleCreateImplicitRelation}
                            onCancel={onDismiss}
                        />
                    </PivotItem>

                    <PivotItem
                        headerText={strings.SettingsPanel.relations.visualDiagramTab}
                        itemKey="diagram"
                    >
                        <VisualDiagramTab
                            theme={theme}
                            selectedTable={selectedTable}
                            existingRelations={existingRelations}
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                        />
                    </PivotItem>
                </Pivot>
            </div>
        </Panel>
    );
};

export const RelationsPanel = styled<IRelationsPanelProps, IRelationsPanelStyleProps, IRelationsPanelStyles>(
    RelationsPanelBase,
    getStyles,
    undefined,
    { scope: 'RelationsPanel' }
);
