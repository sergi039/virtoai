import React, { useState, useEffect } from 'react';
import {
  Stack,
  Panel,
  PanelType,
  MessageBarType,
  PrimaryButton,
  DefaultButton,
  styled,
} from '@fluentui/react';
import {
  ISchemaEditorProps,
  ISchemaEditorStyleProps,
  ISchemaEditorStyles,
  ISQLOperation,
} from './SchemaEditor.types';
import { getClassNames, getStyles } from './SchemaEditor.styles';
import { useNL2SQLStore } from '../../../../stores/useNL2SQLStore';
import { ITableSchema, ITableField } from '../../../../api/model/ITableSchema';
import { PostgreSQLGenerator } from '../../../../utils/postgreSQLGenerator';
import { FieldContextMenuItem } from '../../../../api/model/IServiceRegistry';
import { TablesSection } from './TablesSection';
import { FieldsSection } from './FieldsSection';
import { RelationsPanel } from './RelationsPanel';
import { TableEditor } from './TableEditor';
import { FieldEditor } from './FieldEditor';
import { MessageBarWrapper } from './MessageBarWrapper';
import { postgresqlFieldTypes } from '../../../../api/constants/DatabaseInfo';
import { IServiceRegistry, IServiceTable } from '../../../../api/model/IServiceRegistry';

const SchemaEditorBase: React.FC<ISchemaEditorProps> = ({ theme, selectedService }) => {
  const {
    databaseSchema,
    isLoading,
    executeSql,
    setDatabaseSchema,
    serviceRegistrations,
    setServiceRegistrations,
    getTablesByServiceId,
    createServiceTable,
    updateServiceTable,
    deleteServiceTable,
    updateOrCreateServiceTableField,
    deleteServiceTableField,
    getServiceTableFieldByTableAndFieldName,
    getAllServiceTableFields,
    getDatabaseSchemaForEditor,
    createFieldContextMenuItem,
    updateFieldContextMenuItem,
    deleteFieldContextMenuItem
  } = useNL2SQLStore();
  const [allTables, setAllTables] = useState<ITableSchema[]>([]);
  const [tables, setTables] = useState<ITableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<ITableSchema | null>(null);
  const [isTablePanelOpen, setIsTablePanelOpen] = useState<boolean>(false);
  const [isFieldPanelOpen, setIsFieldPanelOpen] = useState<boolean>(false);
  const [isRelationsPanelOpen, setIsRelationsPanelOpen] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<ITableField | null>(null);
  const [originalField, setOriginalField] = useState<ITableField | null>(null);
  const [message, setMessage] = useState<{ text: string; type: MessageBarType } | null>(null);
  const [editingTable, setEditingTable] = useState<ITableSchema | null>(null);
  const [originalTable, setOriginalTable] = useState<ITableSchema | null>(null);
  const [editingTableIsActive, setEditingTableIsActive] = useState<boolean>(true);
  const [isAddingTable, setIsAddingTable] = useState<boolean>(false);
  const [service, setService] = useState<IServiceRegistry | null>(null);
  const [currentFieldValues, setCurrentFieldValues] = useState<{
    field: ITableField;
    redirectUrl: string;
    originalRedirectUrl: string;
    isHidden: boolean;
    contextMenuItems: FieldContextMenuItem[];
    originalContextMenuItems: FieldContextMenuItem[];
  } | null>(null);

  const styleProps: ISchemaEditorStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  useEffect(() => {
    if (databaseSchema && databaseSchema.tables) {
      setAllTables(databaseSchema.tables);
    } else {
      setAllTables([]);
    }
  }, [databaseSchema]);

  useEffect(() => {
    const filteredTables = filterTablesByService(allTables, selectedService);
    setTables(filteredTables);

    if (filteredTables.length > 0) {
      if (!selectedTable || !filteredTables.find((t) => t.id === selectedTable.id)) {
        const tableByName = selectedTable ? filteredTables.find(t => t.name === selectedTable.name) : null;

        if (tableByName) {
          setSelectedTable(tableByName);
        } else if (!isAddingTable) {
          setSelectedTable(filteredTables[0]);
        }
      }
    } else {
      if (!isAddingTable) {
        setSelectedTable(null);
      }
    }
  }, [allTables, selectedService, selectedTable, isAddingTable]);

  useEffect(() => {
    if (selectedService && serviceRegistrations.length > 0) {
      const foundService = serviceRegistrations.find(s =>
        s.name.toLowerCase() === selectedService.toLowerCase()
      );
      setService(foundService || null);
    } else {
      setService(null);
    }
  }, [selectedService, serviceRegistrations]);

  useEffect(() => {
    if (selectedService && allTables.length > 0) {
      const filteredTables = filterTablesByService(allTables, selectedService);
      setTables(filteredTables);

      if (selectedTable) {
        const updatedSelectedTable = filteredTables.find(t => t.name === selectedTable.name);
        if (updatedSelectedTable && JSON.stringify(updatedSelectedTable) !== JSON.stringify(selectedTable)) {
          setSelectedTable(updatedSelectedTable);
        }
      }
    }
  }, [serviceRegistrations, selectedService, allTables, selectedTable]);

  useEffect(() => {
    const loadServiceTableFields = async () => {
      try {
        await getAllServiceTableFields();
      } catch (error) {
        console.error('Failed to load serviceTableFields:', error);
      }
    };

    loadServiceTableFields();
  }, []);

  const handleTableEditorChange = (table: ITableSchema, isActive?: boolean) => {
    setEditingTable(table);
    if (isActive !== undefined) {
      setEditingTableIsActive(isActive);
    }
  };

  const getTableActiveStatus = (tableName: string): boolean => {
    if (!service) return true;
    const serviceTable = service.serviceTables.find(st => st.name === tableName);
    return serviceTable?.isActive ?? true;
  };

  const filterTablesByService = (allTables: ITableSchema[], serviceName?: string): ITableSchema[] => {
    if (!serviceName) return allTables;

    const service = serviceRegistrations.find(
      (registration) => registration.name.toLowerCase() === serviceName.toLowerCase()
    );

    if (service) {
      const availableTableNames = service.serviceTables.map((table) => table.name);
      return allTables
        .filter((table) => availableTableNames.includes(table.name))
        .map((table) => {
          const serviceTable = service.serviceTables.find(
            (st) => st.name === table.name
          );

          if (serviceTable) {
            return {
              ...table,
              implicitRelations: serviceTable.implicitRelationsAsPrimary
            };
          }
          return table;
        });
    }

    return [];
  };

  const executeOperations = async (operations: ISQLOperation[]): Promise<{ success: boolean; error?: string }> => {
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      const result = await executeSql(operation.sql);
      if (!result.isSuccess) {
        return { success: false, error: result.errorMessage };
      }
    }
    return { success: true };
  };

  const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  };

  const handleAddTable = () => {
    const newTable = {
      id: Date.now().toString(),
      name: '',
      description: '',
      fields: [],
      foreignKeys: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setIsAddingTable(true);
    setEditingTable(newTable);
    setEditingTableIsActive(true);
    setSelectedTable(newTable);
    setOriginalTable(null);
    setIsTablePanelOpen(true);
  };

  const handleEditTable = () => {
    if (selectedTable) {
      const currentIsActive = getTableActiveStatus(selectedTable.name);
      setEditingTable({ ...selectedTable });
      setEditingTableIsActive(currentIsActive);
      setOriginalTable({ ...selectedTable });
      setIsTablePanelOpen(true);
    }
  };

  const handleDeleteTable = async () => {
    if (!selectedTable) return;

    if (window.confirm(`Delete table "${selectedTable.name}"?`)) {
      try {
        const operation = PostgreSQLGenerator.generateDropTableSQL(selectedTable.name);
        const result = await executeSql(operation.sql);

        if (!result.isSuccess) {
          setMessage({
            text: `Failed to delete table "${selectedTable.name}": ${result.errorMessage}`,
            type: MessageBarType.error
          });
          return;
        }

        const existTableId = service?.serviceTables.find(t => t.name.toLowerCase() === selectedTable.name.toLowerCase())?.id;

        if (existTableId) {
          try {
            await deleteServiceTable(existTableId);
          } catch (error) {
            setMessage({
              text: `Failed to delete table from service registry: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: MessageBarType.error
            });
            return;
          }
        }

        if (service) {
          const updatedService = {
            ...service,
            serviceTables: service.serviceTables.filter((t) => t.name !== selectedTable.name)
          };

          const updatedServiceRegistrations = serviceRegistrations.map((s) =>
            s.id === service.id ? updatedService : s
          );

          setServiceRegistrations(updatedServiceRegistrations);
        }

        const allTables = (databaseSchema?.tables ?? []).filter((t) => t.id !== selectedTable.id);
        const updatedSchema = {
          ...databaseSchema,
          tables: allTables,
          databaseName: databaseSchema?.databaseName ?? ''
        };

        setDatabaseSchema(updatedSchema);
        setTables(allTables);
        setSelectedTable(null);
        setMessage({ text: `Table "${selectedTable.name}" deleted successfully`, type: MessageBarType.success });
      } catch (error) {
        setMessage({
          text: `Failed to delete table "${selectedTable.name}": ${getErrorMessage(error)}`,
          type: MessageBarType.error
        });
      }
    }
  };

  const handleAddField = () => {
    setEditingField({
      id: Date.now().toString(),
      name: '',
      displayName: '',
      type: 'varchar',
      isRequired: false,
      isPrimaryKey: false,
      isUnique: false,
      description: ''
    });
    setOriginalField(null);
    setIsFieldPanelOpen(true);
  };

  const handleEditField = () => {
    if (editingField) {
      setOriginalField({ ...editingField });
    }
    setIsFieldPanelOpen(true);
  };

  const handleDeleteField = async () => {
    if (!editingField || !selectedTable) return;

    if (window.confirm(`Delete field "${editingField.name}"?`)) {
      const operation = PostgreSQLGenerator.generateDropColumnSQL(selectedTable.name, editingField);
      PostgreSQLGenerator.logOperation(operation);

      try {
        const result = await executeSql(operation.sql);

        if (!result.isSuccess) {
          setMessage({
            text: `Failed to delete field "${editingField.name}": ${result.errorMessage}`,
            type: MessageBarType.error
          });
          return;
        }

        const updatedTable = {
          ...selectedTable,
          fields: selectedTable.fields.filter(f => f.id !== editingField.id),
          updatedAt: new Date()
        };

        if (selectedTable.name) {
          try {
            const serviceField = getServiceTableFieldByTableAndFieldName(selectedTable.name, editingField.name);
            if (serviceField) {
              await deleteServiceTableField(serviceField.id);
            }
          } catch (error) {
            setMessage({
              text: `Field deleted but error removing configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: MessageBarType.warning
            });
          }
        }

        const updatedTables = (databaseSchema?.tables ?? []).map(t =>
          t.id === selectedTable.id ? updatedTable : t
        );
        const updatedSchema = {
          ...databaseSchema,
          tables: updatedTables,
          databaseName: databaseSchema?.databaseName ?? ''
        };

        setDatabaseSchema(updatedSchema);
        setTables(updatedTables);
        setSelectedTable(updatedTable);
        setEditingField(null);
        setMessage({ text: `Field "${editingField.name}" deleted successfully`, type: MessageBarType.success });
      } catch (error) {
        setMessage({
          text: `Failed to delete field "${editingField.name}": ${getErrorMessage(error)}`,
          type: MessageBarType.error
        });
      }
    }
  };

  const handleCancelTable = () => {
    setIsTablePanelOpen(false);
    setEditingTable(null);
    setEditingTableIsActive(true);
    setOriginalTable(null);
    setIsAddingTable(false);
  }

  const handleSaveTable = async () => {
    if (!editingTable) return;

    const allTables = databaseSchema?.tables ?? [];
    const existingIndex = allTables.findIndex(t => t.id === editingTable.id);

    if (existingIndex >= 0) {
      const updatedTable = { ...editingTable, updatedAt: new Date() };

      if (originalTable) {
        const operations = PostgreSQLGenerator.generateAlterTableSQL(originalTable, updatedTable);
        PostgreSQLGenerator.logOperations(operations);

        try {
          const operationsResult = await executeOperations(operations);

          if (!operationsResult.success) {
            setMessage({
              text: `Failed to update table "${editingTable.name}": ${operationsResult.error}`,
              type: MessageBarType.error
            });
            return;
          }

          const existTableId = service?.serviceTables.find(t => t.name.toLowerCase() === originalTable.name.toLowerCase())?.id;

          if (existTableId) {
            try {
              const existingServiceTable = service?.serviceTables.find(t => t.id === existTableId);
              if (existingServiceTable) {
                const updatedServiceTable = {
                  ...existingServiceTable,
                  name: updatedTable.name,
                  isActive: editingTableIsActive
                };

                const isActiveChanged = existingServiceTable.isActive !== updatedServiceTable.isActive;

                await updateServiceTable(existTableId, updatedServiceTable);

                if (isActiveChanged) {
                  setMessage({
                    text: `Table "${editingTable.name}" updated successfully. Active status changed to: ${updatedServiceTable.isActive ? 'Active' : 'Inactive'}`,
                    type: MessageBarType.success
                  });
                }
              }
            } catch (error) {
              setMessage({
                text: `Failed to update service table: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: MessageBarType.error
              });
              return;
            }
          }

          if (service) {
            const tables = await getTablesByServiceId(service.id);

            const updatedService = {
              ...service,
              serviceTables: tables
            };

            const updatedServiceRegistrations = serviceRegistrations.map((s) =>
              s.id === service.id ? updatedService : s
            );

            setServiceRegistrations(updatedServiceRegistrations);
          }

          const updatedTables = [...allTables];
          updatedTables[existingIndex] = updatedTable;
          const updatedSchema = {
            ...databaseSchema,
            tables: updatedTables,
            databaseName: databaseSchema?.databaseName ?? ''
          };
          setDatabaseSchema(updatedSchema);

          const filteredTables = updatedTables.filter(t =>
            selectedService
              ? t.name.toLowerCase().includes(selectedService.toLowerCase())
              : true
          );

          setTables(filteredTables);

          const updatedSelectedTable = filteredTables.find(t => t.id === updatedTable.id);
          if (updatedSelectedTable) {
            setSelectedTable(updatedSelectedTable);
          }

          setMessage({ text: `Table "${editingTable.name}" updated successfully`, type: MessageBarType.success });
        } catch (error) {
          setMessage({
            text: `Failed to update table "${editingTable.name}": ${getErrorMessage(error)}`,
            type: MessageBarType.error
          });
          return;
        }
      } else {
        const updatedTables = [...tables];
        updatedTables[existingIndex] = updatedTable;

        const updatedSchema = {
          ...databaseSchema,
          tables: updatedTables,
          databaseName: databaseSchema?.databaseName ?? ''
        };
        setDatabaseSchema(updatedSchema);

        setTables(updatedTables);
        setMessage({ text: `Table "${editingTable.name}" updated successfully`, type: MessageBarType.success });
      }
    } else {
      const newTable = { ...editingTable, createdAt: new Date(), updatedAt: new Date() };
      const operation = PostgreSQLGenerator.generateCreateTableSQL(newTable);
      PostgreSQLGenerator.logOperation(operation);

      try {
        const createTableResult = await executeSql(operation.sql);

        if (!createTableResult.isSuccess) {
          setMessage({
            text: `Failed to create table "${editingTable.name}": ${createTableResult.errorMessage}`,
            type: MessageBarType.error
          });
          return;
        }

        if (service) {
          try {
            const newServiceTable: IServiceTable = {
              id: 0,
              name: newTable.name,
              isActive: editingTableIsActive,
              serviceRegistryEntityId: service.id,
              tableFields: [],
              implicitRelationsAsPrimary: []
            };
            await createServiceTable(newServiceTable);
          } catch (error) {
            setMessage({
              text: `Failed to register table in service: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: MessageBarType.error
            });
            return;
          }
        }

        if (service) {
          const tables = await getTablesByServiceId(service.id);

          const updatedService = {
            ...service,
            serviceTables: tables
          };

          const updatedServiceRegistrations = serviceRegistrations.map((s) =>
            s.id === service.id ? updatedService : s
          );

          setServiceRegistrations(updatedServiceRegistrations);
        }

        const updatedTables = [...allTables, newTable];
        const updatedSchema = {
          ...databaseSchema,
          tables: updatedTables,
          databaseName: databaseSchema?.databaseName ?? ''
        };
        setDatabaseSchema(updatedSchema);

        const filteredTables = updatedTables.filter(t =>
          selectedService
            ? t.name.toLowerCase().includes(selectedService.toLowerCase())
            : true
        );

        setTables(filteredTables);

        const updatedSelectedTable = filteredTables.find(t => t.id === newTable.id);
        if (updatedSelectedTable) {
          setSelectedTable(updatedSelectedTable);
        }

        setMessage({ text: `Table "${editingTable.name}" created successfully`, type: MessageBarType.success });
      } catch (error) {
        setMessage({
          text: `Failed to create table "${editingTable.name}": ${getErrorMessage(error)}`,
          type: MessageBarType.error
        });
        return;
      }
    }

    setSelectedTable(editingTable);
    setEditingTable(null);
    setEditingTableIsActive(true);
    setOriginalTable(null);
    setIsTablePanelOpen(false);
    setIsAddingTable(false);
  };

  const syncContextMenuItems = async (existingServiceField: any, currentContextMenuItems: FieldContextMenuItem[], originalContextMenuItems: FieldContextMenuItem[]) => {
    console.log('Syncing context menu items for field:', existingServiceField.name);
    console.log('Current context menu items:', currentContextMenuItems);
    console.log('Original context menu items:', originalContextMenuItems);
    if (!existingServiceField) return;

    const itemsToCreate = currentContextMenuItems.filter(item =>
      item.id < 0 &&
      !originalContextMenuItems.find(orig => orig.name === item.name)
    );

    const itemsToUpdate = currentContextMenuItems.filter(item =>
      item.id > 0 &&
      originalContextMenuItems.find(orig => orig.id === item.id && orig.name !== item.name)
    );

    const itemsToDelete = originalContextMenuItems.filter(orig =>
      !currentContextMenuItems.find(curr => curr.id === orig.id)
    );

    try {
      for (const item of itemsToCreate) {
        const newItem: FieldContextMenuItem = {
          id: 0,
          name: item.name,
          sortOrder: item.sortOrder,
          serviceTableFieldId: existingServiceField.id
        };
        await createFieldContextMenuItem(newItem);
      }

      for (const item of itemsToUpdate) {
        await updateFieldContextMenuItem(item.id, item);
      }

      for (const item of itemsToDelete) {
        await deleteFieldContextMenuItem(item.id);
      }
    } catch (error) {
      console.error('Error syncing context menu items:', error);
      throw error;
    }
  };

  const handleSaveField = async () => {
    if (!editingField || !selectedTable || !currentFieldValues) return;

    const { field, redirectUrl, isHidden, contextMenuItems, originalContextMenuItems } = currentFieldValues;

    const existingIndex = selectedTable.fields.findIndex(f => f.id === field.id);
    let updatedFields;

    if (existingIndex >= 0) {
      updatedFields = [...selectedTable.fields];
      updatedFields[existingIndex] = field;

      if (originalField) {
        const operations = PostgreSQLGenerator.generateAlterColumnSQL(selectedTable.name, originalField, field);
        PostgreSQLGenerator.logOperations(operations);

        try {
          await executeOperations(operations);

          setMessage({ text: `Field "${field.name}" updated successfully`, type: MessageBarType.success });

          if (selectedTable.name) {
            try {
              const existingServiceField = getServiceTableFieldByTableAndFieldName(selectedTable.name, field.name);
              const fieldUpdates = {
                displayName: field.displayName || field.name,
                isHidden: isHidden,
                isAiContextGenerationEnabled: currentFieldValues.field.isAiContextGenerationEnabled || false,
                urlTemplate: redirectUrl || '',
                contextMenuItems: existingServiceField?.contextMenuItems || []
              };

              await updateOrCreateServiceTableField(
                selectedTable.name,
                field.name,
                fieldUpdates
              );

              if (existingServiceField && !currentFieldValues.field.isAiContextGenerationEnabled) {
                await syncContextMenuItems(existingServiceField, contextMenuItems, originalContextMenuItems);
              }

            } catch (error) {
              setMessage({
                text: `Field updated but error updating configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: MessageBarType.warning
              });
            }
          }
        } catch (error) {
          setMessage({
            text: `Failed to update field "${field.name}": ${getErrorMessage(error)}`,
            type: MessageBarType.error
          });
          return;
        }
      } else {
        setMessage({ text: `Field "${field.name}" updated successfully`, type: MessageBarType.success });

        if (selectedTable.name) {
          try {
            const existingServiceField = getServiceTableFieldByTableAndFieldName(selectedTable.name, field.name);

            if (existingServiceField && !currentFieldValues.field.isAiContextGenerationEnabled) {
              await syncContextMenuItems(existingServiceField, contextMenuItems, originalContextMenuItems);
            }

            const fieldUpdates = {
              displayName: field.displayName || field.name,
              isHidden: isHidden,
              isAiContextGenerationEnabled: currentFieldValues.field.isAiContextGenerationEnabled || false,
              urlTemplate: redirectUrl || '',
              contextMenuItems: existingServiceField?.contextMenuItems || []
            };

            await updateOrCreateServiceTableField(
              selectedTable.name,
              field.name,
              fieldUpdates
            );
          } catch (error) {
            setMessage({
              text: `Field updated but error updating configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: MessageBarType.warning
            });
          }
        }
      }
    } else {
      updatedFields = [...selectedTable.fields, field];

      const operation = PostgreSQLGenerator.generateAddColumnSQL(selectedTable.name, field);
      PostgreSQLGenerator.logOperation(operation);

      try {
        const result = await executeSql(operation.sql);

        if (!result.isSuccess) {
          setMessage({
            text: `Failed to create field "${field.name}": ${result.errorMessage}`,
            type: MessageBarType.error
          });
          return;
        }

        setMessage({ text: `Field "${field.name}" created successfully`, type: MessageBarType.success });

        if (selectedTable.name) {
          try {
            const fieldUpdates = {
              displayName: field.displayName || field.name,
              isHidden: isHidden,
              isAiContextGenerationEnabled: currentFieldValues.field.isAiContextGenerationEnabled || false,
              urlTemplate: redirectUrl || '',
              contextMenuItems: []
            };

            var resultOperationField = await updateOrCreateServiceTableField(
              selectedTable.name,
              field.name,
              fieldUpdates
            );

            if (!currentFieldValues.field.isAiContextGenerationEnabled && contextMenuItems.length > 0) {
              await syncContextMenuItems(resultOperationField, contextMenuItems, []);
            }
          } catch (error) {
            setMessage({
              text: `Field created but error updating configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: MessageBarType.warning
            });
          }
        }
      } catch (error) {
        setMessage({
          text: `Failed to create field "${field.name}": ${getErrorMessage(error)}`,
          type: MessageBarType.error
        });
        return;
      }
    }

    const updatedTable = {
      ...selectedTable,
      fields: updatedFields,
      updatedAt: new Date()
    };

    const allTables = databaseSchema?.tables ?? [];
    const updatedTables = allTables.map(t =>
      t.id === selectedTable.id ? updatedTable : t
    );
    const updatedSchema = {
      ...databaseSchema,
      tables: updatedTables,
      databaseName: databaseSchema?.databaseName ?? ''
    };
    setDatabaseSchema(updatedSchema);
    setTables(updatedTables.filter(t =>
      selectedService
        ? t.name.toLowerCase().includes(selectedService.toLowerCase())
        : true
    ));
    setSelectedTable(updatedTable);
    setIsFieldPanelOpen(false);
    setEditingField(null);
    setOriginalField(null);
  };

  const handleCloseFieldPanel = () => {
    setIsFieldPanelOpen(false);
    setOriginalField(null);
  };

  const handleManageRelations = () => {
    setIsRelationsPanelOpen(true);
  };

  const handleCloseRelationsPanel = () => {
    setIsRelationsPanelOpen(false);
  };

  const handleRelationChanged = async () => {
    if (selectedTable) {
      const currentTableName = selectedTable.name;

      try {
        setTimeout(async () => {
          const updatedSchema = await getDatabaseSchemaForEditor();
          setDatabaseSchema(updatedSchema);

          const tableToSelect = updatedSchema.tables?.find((t: ITableSchema) => t.name === currentTableName);
          if (tableToSelect) {
            const filteredTables = filterTablesByService(updatedSchema.tables || [], selectedService);
            setTables(filteredTables);

            setSelectedTable(tableToSelect);
          }
        }, 200);
      } catch (error) {
        console.error('Failed to refresh schema after relation change:', error);
      }
    }
  };

  return (
    <div className={classNames.root}>
      <MessageBarWrapper
        theme={theme}
        message={message}
        onDismiss={() => setMessage(null)}
      />

      <Stack tokens={{ childrenGap: 16 }}>
        <TablesSection
          theme={theme}
          tables={tables}
          allTables={allTables}
          selectedTable={selectedTable}
          isLoading={isLoading}
          serviceName={selectedService || ''}
          serviceRegistrations={serviceRegistrations}
          getTableActiveStatus={getTableActiveStatus}
          onTableSelect={setSelectedTable}
          onAddTable={handleAddTable}
          onEditTable={handleEditTable}
          onDeleteTable={handleDeleteTable}
          onManageRelations={handleManageRelations}
        />

        <FieldsSection
          theme={theme}
          selectedTable={selectedTable}
          editingField={editingField}
          onFieldSelect={setEditingField}
          onAddField={handleAddField}
          onEditField={handleEditField}
          onDeleteField={handleDeleteField}
        />
      </Stack>

      <Panel
        isOpen={isTablePanelOpen}
        onDismiss={handleCancelTable}
        type={PanelType.medium}
        headerText={originalTable?.name ? 'Edit Table' : 'Add Table'}
        className={classNames.panel}
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 16 }} style={{ width: '100%', justifyContent: 'space-between' }}>
            <PrimaryButton
              text="Save"
              onClick={() => editingTable && handleSaveTable()}
              disabled={!editingTable?.name?.trim() || databaseSchema?.tables.some(t => t.name === editingTable.name && t.id !== editingTable.id)}
            />
            <DefaultButton text="Cancel" onClick={handleCancelTable} />
          </Stack>
        )}
        isFooterAtBottom={true}
      >
        {editingTable && (
          <TableEditor
            table={editingTable}
            tableNames={databaseSchema?.tables}
            isActive={editingTableIsActive}
            onTableChange={handleTableEditorChange}
          />
        )}
      </Panel>

      <Panel
        isOpen={isFieldPanelOpen}
        onDismiss={handleCloseFieldPanel}
        type={PanelType.medium}
        headerText={editingField?.name ? 'Edit Field' : 'Add Field'}
        className={classNames.panel}
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 16 }} style={{ width: '100%', justifyContent: 'space-between' }}>
            <PrimaryButton
              text="Save"
              onClick={() => handleSaveField()}
              disabled={!editingField?.name?.trim() || selectedTable?.fields.some(f => f.name === editingField.name && f.id !== editingField.id)}
            />
            <DefaultButton text="Cancel" onClick={handleCloseFieldPanel} />
          </Stack>
        )}
        isFooterAtBottom={true}
      >
        {editingField && (
          <FieldEditor
            theme={theme}
            field={editingField}
            existingFields={selectedTable?.fields || []}
            tableName={selectedTable?.name}
            onFieldChange={setEditingField}
            onValuesChange={setCurrentFieldValues}
            postgresqlFieldTypes={postgresqlFieldTypes}
          />
        )}
      </Panel>

      <RelationsPanel
        theme={theme}
        isOpen={isRelationsPanelOpen}
        selectedTable={selectedTable}
        selectedService={selectedService || null}
        serviceRegistrations={serviceRegistrations}
        allTables={allTables}
        onDismiss={handleCloseRelationsPanel}
        onRelationChanged={handleRelationChanged}
      />

    </div>
  );
};

export const SchemaEditor = styled<ISchemaEditorProps, ISchemaEditorStyleProps, ISchemaEditorStyles>(
  SchemaEditorBase,
  getStyles,
  undefined,
  { scope: 'SchemaEditor' }
);
