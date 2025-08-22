import React, { useEffect, useState } from 'react';
import {
  Stack,
  Label,
  DetailsList,
  IColumn,
  CommandBar,
  ICommandBarItemProps,
  SelectionMode,
  Selection,
  styled,
  Icon,
} from '@fluentui/react';
import {
  ITablesSectionProps,
  ITablesSectionStyleProps,
  ITablesSectionStyles,
} from './TablesSection.types';
import { getClassNames, getStyles } from './TablesSection.styles';
import { ITableSchema } from '../../../../../api/model/ITableSchema';
import { IServiceTableImplicitRelation } from '../../../../../api/model/IServiceRegistry';
import strings from '../../../../../Ioc/en-us';

const TablesSectionBase: React.FC<ITablesSectionProps> = ({
  theme,
  tables,
  allTables,
  selectedTable,
  serviceName,
  serviceRegistrations,
  isLoading,
  getTableActiveStatus,
  onTableSelect,
  onAddTable,
  onEditTable,
  onDeleteTable,
  onManageRelations
}) => {
  const [selection] = useState(new Selection());
  const styleProps: ITablesSectionStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  useEffect(() => {
    if (selectedTable && tables.length > 0) {
      const selectedIndex = tables.findIndex(table => table.id === selectedTable.id);
      if (selectedIndex >= 0) {
        selection.setIndexSelected(selectedIndex, true, false);
      }
    }
  }, [selectedTable, tables, selection]);

  const getTableNameById = (serviceTableId: number): string => {
    for (const service of serviceRegistrations) {
      const table = service.serviceTables.find(st => st.id === serviceTableId);
      if (table) {
        return table.name;
      }
    }
    return 'Unknown Table';
  };

  const getTableRelationsComponent = (tableName: string): JSX.Element => {
    const relations: Array<{type: 'outgoing' | 'incoming' | 'implicit', table: string, columns: string}> = [];
    
    const outgoing = allTables
      .flatMap(table => table.foreignKeys || [])
      .filter(fk => fk.sourceTable === tableName)
      .map(fk => ({
        type: 'outgoing' as const,
        table: fk.targetTable,
        columns: `${fk.sourceColumn} → ${fk.targetColumn}`
      }));
    
    relations.push(...outgoing);

    const incoming = allTables
      .flatMap(table => table.foreignKeys || [])
      .filter(fk => fk.targetTable === tableName)
      .map(fk => ({
        type: 'incoming' as const,
        table: fk.sourceTable,
        columns: `${fk.sourceColumn} → ${fk.targetColumn}`
      }));
    
    relations.push(...incoming);

    const currentTable = tables.find(t => t.name === tableName);
    if (currentTable && (currentTable as any).implicitRelations) {
      const implicitRelations = ((currentTable as any).implicitRelations as IServiceTableImplicitRelation[])
        .map(ir => {
          return {
            type: 'implicit' as const,
            table: getTableNameById(ir.relatedServiceTableId),
            columns: `${ir.primaryTableColumn} → ${ir.relatedTableColumn}`
          };
        });
      
      relations.push(...implicitRelations);
    }

    if (relations.length === 0) {
      return (
        <div className={classNames.noRelationsContainer}>
          <Icon 
            iconName="StatusCircleRing" 
            className={classNames.noRelationsIcon}
          />
          <span className={classNames.noRelationsText}>No relations</span>
        </div>
      );
    }

    return (
      <div className={classNames.relationsContainer}>
        {relations.map((relation, index) => (
          <div key={index} className={classNames.relationItem}>
            <Icon
              iconName={
                relation.type === 'outgoing' ? 'Forward' : 
                relation.type === 'incoming' ? 'Back' : 
                'Link'
              }
              className={classNames.relationIcon}
              style={{
                color: 
                  relation.type === 'outgoing' ? '#0078d4' : 
                  relation.type === 'incoming' ? '#107c10' : 
                  '#ca5010',
              }}
            />
            <span className={classNames.relationTableName}>
              {relation.table}
            </span>
            <span className={classNames.relationColumns}>
              {relation.columns}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const tableColumns: IColumn[] = [
    {
      key: 'name',
      name: strings.SettingsPanel.TablesSection.tableNameColumn,
      fieldName: 'name',
      minWidth: 150,
      maxWidth: 250,
      isResizable: true,
    },
    {
      key: 'fieldsCount',
      name: strings.SettingsPanel.TablesSection.fieldsCountColumn,
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITableSchema) => item.fields.length,
    },
    {
      key: 'relations',
      name: strings.SettingsPanel.TablesSection.relationsTitle,
      minWidth: 200,
      maxWidth: 400,
      isResizable: true,
      isMultiline: true,
      onRender: (item: ITableSchema) => {
        return getTableRelationsComponent(item.name);
      },
    },
    {
      key: 'isActive',
      name: strings.SettingsPanel.TablesSection.statusColumn,
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITableSchema) => {
        const isActive = getTableActiveStatus(item.name);
        return (
          <span>
            {isActive ? '✅' : '❌'}
          </span>
        );
      },
    }
  ];

  const tableCommandBarItems: ICommandBarItemProps[] = [
    {
      key: 'addTable',
      text: strings.SettingsPanel.TablesSection.addTable,
      iconProps: { iconName: 'Add' },
      onClick: onAddTable
    },
    {
      key: 'editTable',
      text: strings.SettingsPanel.TablesSection.editTable,
      iconProps: { iconName: 'Edit' },
      disabled: !selectedTable,
      onClick: onEditTable
    },
    {
      key: 'deleteTable',
      text: strings.SettingsPanel.TablesSection.deleteTable,
      iconProps: { iconName: 'Delete' },
      disabled: !selectedTable,
      onClick: onDeleteTable
    },
    {
      key: 'manageRelations',
      text: strings.SettingsPanel.TablesSection.manageRelations,
      iconProps: { iconName: 'Relationship' },
      onClick: onManageRelations
    }
  ];

  return (
    <Stack className={classNames.root}>
        <Label className={classNames.sectionTitle}>
          {strings.SettingsPanel.TablesSection.sectionTitle.replace('{0}', serviceName)}
        </Label>
        <CommandBar items={tableCommandBarItems} className={classNames.commandBar} />
        
        {isLoading ? (
          <div className={classNames.loadingContainer}>
            <Label>{strings.SettingsPanel.TablesSection.loadingMessage}</Label>
          </div>
        ) : (
          <DetailsList
            items={tables}
            columns={tableColumns}
            selectionMode={SelectionMode.single}
            selection={selection}
            onActiveItemChanged={onTableSelect}
            className={classNames.tablesList}
          />
        )}
    </Stack>
  );
};

export const TablesSection = styled<ITablesSectionProps, ITablesSectionStyleProps, ITablesSectionStyles>(
  TablesSectionBase,
  getStyles,
  undefined,
  { scope: 'TablesSection' }
);