import React, { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  Dropdown,
  Toggle,
  styled,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  IconButton,
  Text
} from '@fluentui/react';
import {
  IFieldEditorProps,
  IFieldEditorStyleProps,
  IFieldEditorStyles,
} from './FieldEditor.types';
import { getClassNames, getStyles } from './FieldEditor.styles';
import { ITableField } from '../../../../../api/model/ITableSchema';
import { PostgreSQLFieldType } from '../../../../../api/constants/DatabaseInfo';
import { useNL2SQLStore } from '../../../../../stores/useNL2SQLStore';
import { FieldContextMenuItem } from '../../../../../api/model/IServiceRegistry';
import strings from '../../../../../Ioc/en-us';

const FieldEditorBase: React.FC<IFieldEditorProps> = ({
  theme,
  field,
  onFieldChange,
  onValuesChange,
  existingFields,
  tableName,
  postgresqlFieldTypes
}) => {
  const [editedField, setEditedField] = useState<ITableField>(field);
  const [message, setMessage] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [originalRedirectUrl, setOriginalRedirectUrl] = useState<string>('');
  const [isAiContextEnabled, setIsAiContextEnabled] = useState<boolean>(false);
  const [contextMenuItems, setContextMenuItems] = useState<FieldContextMenuItem[]>([]);
  const [originalContextMenuItems, setOriginalContextMenuItems] = useState<FieldContextMenuItem[]>([]);
  const [newContextItemName, setNewContextItemName] = useState<string>('');
  const [editingContextItemId, setEditingContextItemId] = useState<number | null>(null);
  const [editingContextItemName, setEditingContextItemName] = useState<string>('');
  const {
    getServiceTableFieldByTableAndFieldName,
    serviceTableFields
  } = useNL2SQLStore();

  const styleProps: IFieldEditorStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  const notifyValuesChange = () => {
    if (onValuesChange) {
      onValuesChange({
        field: { ...editedField, isHidden, isAiContextGenerationEnabled: isAiContextEnabled },
        redirectUrl,
        originalRedirectUrl,
        isHidden,
        contextMenuItems,
        originalContextMenuItems
      });
    }
  };

  useEffect(() => {
    let initialField = { ...field };

    if (tableName && field.name) {
      const serviceField = getServiceTableFieldByTableAndFieldName(tableName, field.name);
      if (serviceField) {
        if (initialField.displayName === undefined) {
          initialField.displayName = serviceField.displayName || '';
        }
      }
    }

    setEditedField(initialField);
  }, [field, tableName, getServiceTableFieldByTableAndFieldName]);

  useEffect(() => {
    if (tableName && field.name) {
      const serviceField = getServiceTableFieldByTableAndFieldName(tableName, field.name);
      setIsHidden(serviceField?.isHidden || false);
    } else {
      setIsHidden(false);
    }
  }, [field.name, tableName, getServiceTableFieldByTableAndFieldName]);

  useEffect(() => {
    if (tableName && field.name) {
      const serviceField = getServiceTableFieldByTableAndFieldName(tableName, field.name);
      const urlTemplate = serviceField?.urlTemplate || '';
      setRedirectUrl(urlTemplate);
      setOriginalRedirectUrl(urlTemplate);
    } else {
      setRedirectUrl('');
      setOriginalRedirectUrl('');
    }
  }, [field.name, tableName, getServiceTableFieldByTableAndFieldName]);

  useEffect(() => {
    if (tableName && field.name) {
      const serviceField = getServiceTableFieldByTableAndFieldName(tableName, field.name);
      setIsAiContextEnabled(serviceField?.isAiContextGenerationEnabled || false);
      const currentContextMenuItems = serviceField?.contextMenuItems || [];
      setContextMenuItems([...currentContextMenuItems]);
      setOriginalContextMenuItems([...currentContextMenuItems]);
    } else {
      setIsAiContextEnabled(false);
      setContextMenuItems([]);
      setOriginalContextMenuItems([]);
    }
  }, [field.name, tableName, getServiceTableFieldByTableAndFieldName, serviceTableFields]);

  useEffect(() => {
    notifyValuesChange();
  }, [editedField, isHidden, redirectUrl, originalRedirectUrl, isAiContextEnabled, contextMenuItems, originalContextMenuItems]);

  const handleFieldChange = (updatedField: ITableField) => {
    if (existingFields.some(f => f.name.toLowerCase() === updatedField.name.toLowerCase() && f.id !== updatedField.id)) {
      setMessage(strings.SettingsPanel.FieldEditor.errorFieldNameExists);
    } else {
      setMessage(null);
    }

    setEditedField(updatedField);
    if (onFieldChange) {
      const fieldWithHiddenState = { ...updatedField, isHidden };
      onFieldChange(fieldWithHiddenState);
    }
  };

  const handleHiddenToggle = (checked: boolean) => {
    setIsHidden(checked);
    const fieldWithHiddenState = { ...editedField, isHidden: checked };
    if (onFieldChange) {
      onFieldChange(fieldWithHiddenState);
    }
  };

  const handleRedirectUrlChange = (value: string) => {
    let formattedUrl = value;
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      formattedUrl = `https://${value}`;
    }
    setRedirectUrl(formattedUrl);
  };

  const handleAiContextToggle = (checked: boolean) => {
    setIsAiContextEnabled(checked);
  };

  const handleAddContextMenuItem = () => {
    if (!newContextItemName.trim()) return;

    const newItem: FieldContextMenuItem = {
      id: -(Date.now()), 
      name: newContextItemName.trim(),
      sortOrder: contextMenuItems.length + 1,
      serviceTableFieldId: 0 
    };

    setContextMenuItems([...contextMenuItems, newItem]);
    setNewContextItemName('');
  };

  const handleEditContextMenuItem = (item: FieldContextMenuItem) => {
    setEditingContextItemId(item.id);
    setEditingContextItemName(item.name);
  };

  const handleSaveContextMenuItem = () => {
    if (!editingContextItemName.trim() || editingContextItemId === null) return;

    const updatedItems = contextMenuItems.map(item =>
      item.id === editingContextItemId 
        ? { ...item, name: editingContextItemName.trim() }
        : item
    );

    setContextMenuItems(updatedItems);
    setEditingContextItemId(null);
    setEditingContextItemName('');
  };

  const handleCancelEditContextMenuItem = () => {
    setEditingContextItemId(null);
    setEditingContextItemName('');
  };

  const handleDeleteContextMenuItem = (itemId: number) => {
    setContextMenuItems(contextMenuItems.filter(item => item.id !== itemId));
  };

  return (
    <div className={classNames.root}>
      <div className={classNames.content}>
        {message && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
          >
            {message}
          </MessageBar>
        )}

        <Stack className={classNames.formContainer} tokens={{ childrenGap: 16 }}>
          <TextField
            label={strings.SettingsPanel.FieldEditor.fieldNameLabel}
            value={editedField.name}
            onChange={(_, value) => {
              const updatedField = { ...editedField, name: value || '' };
              handleFieldChange(updatedField);
            }}
            required
          />

          <TextField
            label={strings.SettingsPanel.FieldEditor.displayNameLabel}
            value={editedField.displayName || ''}
            onChange={(_, value) => {
              const updatedField = { ...editedField, displayName: value ?? '' };
              handleFieldChange(updatedField);
            }}
            placeholder={strings.SettingsPanel.FieldEditor.displayNamePlaceholder}
          />

          <Dropdown
            label={strings.SettingsPanel.FieldEditor.dataTypeLabel}
            selectedKey={editedField.type}
            options={postgresqlFieldTypes}
            onChange={(_, option) => {
              const updatedField = { ...editedField, type: option?.key as PostgreSQLFieldType };
              handleFieldChange(updatedField);
            }}
            required
          />

          <TextField
            label={strings.SettingsPanel.FieldEditor.redirectUrlLabel}
            value={redirectUrl}
            onChange={(_, value) => handleRedirectUrlChange(value || '')}
            placeholder={strings.SettingsPanel.FieldEditor.redirectUrlPlaceholder}
            description={strings.SettingsPanel.FieldEditor.redirectUrlDescription}
            disabled={!tableName || !editedField.name}
          />

          <Toggle
            label={strings.SettingsPanel.FieldEditor.hiddenFieldLabel}
            checked={isHidden}
            onChange={(_, checked) => handleHiddenToggle(!!checked)}
            disabled={!tableName || !editedField.name}
          />

          <Toggle
            label={strings.SettingsPanel.FieldEditor.aiContextGenerationLabel}
            checked={isAiContextEnabled}
            onChange={(_, checked) => handleAiContextToggle(!!checked)}
            disabled={!tableName || !editedField.name}
          />

          <Stack tokens={{ childrenGap: 8 }} className={classNames.toggleGroup}>
            <Toggle
              label={strings.SettingsPanel.FieldEditor.requiredLabel}
              checked={editedField.isRequired}
              onChange={(_, checked) => {
                const updatedField = { ...editedField, isRequired: !!checked };
                handleFieldChange(updatedField);
              }}
            />

            <Toggle
              label={strings.SettingsPanel.FieldEditor.primaryKeyLabel}
              checked={editedField.isPrimaryKey}
              onChange={(_, checked) => {
                const updatedField = {
                  ...editedField,
                  isPrimaryKey: !!checked,
                  isRequired: checked || editedField.isRequired,
                  isUnique: checked || editedField.isUnique,
                };
                handleFieldChange(updatedField);
              }}
            />

            <Toggle
              label={strings.SettingsPanel.FieldEditor.uniqueConstraintLabel}
              checked={editedField.isUnique}
              onChange={(_, checked) => {
                const updatedField = { ...editedField, isUnique: !!checked };
                handleFieldChange(updatedField);
              }}
              disabled={editedField.isPrimaryKey}
            />
          </Stack>

          {!isAiContextEnabled && tableName && editedField.name && (
            <div className={classNames.contextMenuSection}>
              <div className={classNames.contextMenuHeaderBlock}>
                <Text variant="mediumPlus" className={classNames.contextMenuHeader}>
                  {strings.SettingsPanel.FieldEditor.contextMenuTitle}
                </Text>
              </div>

              <div className={classNames.contextMenuInputContainer}>
                <TextField
                  placeholder={strings.SettingsPanel.FieldEditor.contextMenuItemNamePlaceholder}
                  value={newContextItemName}
                  onChange={(_, value) => setNewContextItemName(value || '')}
                  className={classNames.contextMenuInputField}
                />
                <PrimaryButton
                  text={strings.SettingsPanel.FieldEditor.addContextMenuItem}
                  onClick={handleAddContextMenuItem}
                  disabled={!newContextItemName.trim()}
                />
              </div>

              {contextMenuItems.length === 0 ? (
                <div className={classNames.noItemsText}>
                  {strings.SettingsPanel.FieldEditor.noContextMenuItems}
                </div>
              ) : (
                <div className={classNames.contextMenuList}>
                  {contextMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className={editingContextItemId === item.id ? classNames.contextMenuItemEditing : classNames.contextMenuItem}
                    >
                      {editingContextItemId === item.id ? (
                        <>
                          <TextField
                            value={editingContextItemName}
                            onChange={(_, value) => setEditingContextItemName(value || '')}
                            styles={{ root: { flex: 1 } }}
                          />
                          <div className={classNames.contextMenuItemActions}>
                            <IconButton
                              iconProps={{ iconName: 'CheckMark' }}
                              title="Save"
                              onClick={handleSaveContextMenuItem}
                            />
                            <IconButton
                              iconProps={{ iconName: 'Cancel' }}
                              title="Cancel"
                              onClick={handleCancelEditContextMenuItem}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Text className={classNames.contextMenuItemText}>{item.name}</Text>
                          <div className={classNames.contextMenuItemActions}>
                            <IconButton
                              iconProps={{ iconName: 'Edit' }}
                              title={strings.SettingsPanel.FieldEditor.editContextMenuItem}
                              onClick={() => handleEditContextMenuItem(item)}
                            />
                            <IconButton
                              iconProps={{ iconName: 'Delete' }}
                              title={strings.SettingsPanel.FieldEditor.deleteContextMenuItem}
                              onClick={() => handleDeleteContextMenuItem(item.id)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Stack>
      </div>
    </div>
  );
};

export const FieldEditor = styled<IFieldEditorProps, IFieldEditorStyleProps, IFieldEditorStyles>(
  FieldEditorBase,
  getStyles,
  undefined,
  { scope: 'FieldEditor' }
);
