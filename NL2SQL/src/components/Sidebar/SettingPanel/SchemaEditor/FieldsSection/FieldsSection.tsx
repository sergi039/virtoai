import React from 'react';
import {
  Stack,
  Label,
  DetailsList,
  IColumn,
  CommandBar,
  ICommandBarItemProps,
  SelectionMode,
  styled,
} from '@fluentui/react';
import {
  IFieldsSectionProps,
  IFieldsSectionStyleProps,
  IFieldsSectionStyles,
} from './FieldsSection.types';
import { getClassNames, getStyles } from './FieldsSection.styles';
import { ITableField } from '../../../../../api/model/ITableSchema';
import { useNL2SQLStore } from '../../../../../stores/useNL2SQLStore';
import strings from '../../../../../Ioc/en-us';

const FieldsSectionBase: React.FC<IFieldsSectionProps> = ({
  theme,
  selectedTable,
  editingField,
  onFieldSelect,
  onAddField,
  onEditField,
  onDeleteField
}) => {
  const { getServiceTableFieldByTableAndFieldName } = useNL2SQLStore();
  const styleProps: IFieldsSectionStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  const fieldColumns: IColumn[] = [
    {
      key: 'name',
      name: strings.SettingsPanel.FieldsSection.fieldName,
      fieldName: 'name',
      minWidth: 120,
      maxWidth: 180,
      isResizable: true,
    },
    {
      key: 'displayName',
      name: strings.SettingsPanel.FieldsSection.displayName,
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: ITableField) => {
        if (!selectedTable) return item.displayName || '-';
        const serviceField = getServiceTableFieldByTableAndFieldName(selectedTable.name, item.name);
        
        return serviceField?.displayName || item.displayName || '-';
      },
    },
    {
      key: 'type',
      name: strings.SettingsPanel.FieldsSection.type,
      fieldName: 'type',
      minWidth: 80,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: ITableField) => item.type.toUpperCase(),
    },
    {
      key: 'isRequired',
      name: strings.SettingsPanel.FieldsSection.required,
      minWidth: 70,
      maxWidth: 80,
      onRender: (item: ITableField) => item.isRequired ? '✓' : '',
    },
    {
      key: 'isPrimaryKey',
      name: strings.SettingsPanel.FieldsSection.primary,
      minWidth: 70,
      maxWidth: 80,
      onRender: (item: ITableField) => item.isPrimaryKey ? '🔑' : '',
    },
    {
      key: 'isUnique',
      name: strings.SettingsPanel.FieldsSection.unique,
      minWidth: 70,
      maxWidth: 80,
      onRender: (item: ITableField) => item.isUnique ? '⭐' : '',
    },
    {
      key: 'isHidden',
      name: strings.SettingsPanel.FieldsSection.hidden,
      minWidth: 70,
      maxWidth: 80,
      onRender: (item: ITableField) => {
        if (!selectedTable) return '';
        const serviceField = getServiceTableFieldByTableAndFieldName(selectedTable.name, item.name);
        const isHidden = serviceField?.isHidden || false;
        
        return isHidden ? '🚫' : '';
      },
    }
  ];

  const fieldCommandBarItems: ICommandBarItemProps[] = [
    {
      key: 'addField',
      text: strings.SettingsPanel.FieldsSection.addField,
      iconProps: { iconName: 'Add' },
      disabled: !selectedTable,
      onClick: onAddField
    },
    {
      key: 'editField',
      text: strings.SettingsPanel.FieldsSection.editField,
      iconProps: { iconName: 'Edit' },
      disabled: !editingField,
      onClick: onEditField
    },
    {
      key: 'deleteField',
      text: strings.SettingsPanel.FieldsSection.deleteField,
      iconProps: { iconName: 'Delete' },
      disabled: !editingField,
      onClick: onDeleteField
    }
  ];

  if (!selectedTable) {
    return null;
  }

  return (
    <Stack className={classNames.root}>
        <Label className={classNames.sectionTitle}>
          {strings.SettingsPanel.FieldsSection.fieldsInTable.replace('{0}', selectedTable.name)}
        </Label>
        <CommandBar items={fieldCommandBarItems} className={classNames.commandBar} />
        <DetailsList
          items={selectedTable.fields}
          columns={fieldColumns}
          selectionMode={SelectionMode.single}
          onActiveItemChanged={onFieldSelect}
          className={classNames.fieldsList}
        />
    </Stack>
  );
};

export const FieldsSection = styled<IFieldsSectionProps, IFieldsSectionStyleProps, IFieldsSectionStyles>(
  FieldsSectionBase,
  getStyles,
  undefined,
  { scope: 'FieldsSection' }
);
