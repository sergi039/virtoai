import React, { useState } from 'react';
import {
  Stack,
  TextField,
  Toggle,
  styled,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
import {
  ITableEditorProps,
  ITableEditorStyleProps,
  ITableEditorStyles,
} from './TableEditor.types';
import { getClassNames, getStyles } from './TableEditor.styles';
import { ITableSchema } from '../../../../../api/model/ITableSchema';
import strings from '../../../../../Ioc/en-us';

const TableEditorBase: React.FC<ITableEditorProps> = ({
  theme,
  table,
  tableNames,
  isActive = true,
  onTableChange,
}) => {
  const [editedTable, setEditedTable] = useState<ITableSchema>(table);
  const [editedIsActive, setEditedIsActive] = useState<boolean>(isActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const styleProps: ITableEditorStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  const handleTableChange = (updatedTable: ITableSchema, updatedIsActive?: boolean) => {
    if (tableNames && tableNames.some(t => t.name === updatedTable.name && t.id !== updatedTable.id)) {
      setErrorMessage(strings.SettingsPanel.constructor.errorTableNameExists); 
    }
    else{
      setErrorMessage(null);
    }

    setEditedTable(updatedTable);
    if (updatedIsActive !== undefined) {
      setEditedIsActive(updatedIsActive);
    }
    
    if (onTableChange) {
      onTableChange(updatedTable, updatedIsActive !== undefined ? updatedIsActive : editedIsActive);
    }
  };

  return (
    <div className={classNames.root}>
      <div className={classNames.content}>
        {errorMessage && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
          >
            {errorMessage}
          </MessageBar>
        )}
        <Stack className={classNames.formContainer} tokens={{ childrenGap: 16 }}>
          <TextField
            label={strings.SettingsPanel.constructor.nameTable}
            value={editedTable.name}
            onChange={(_, value) => {
              const updatedTable = { ...editedTable, name: value || '' };
              handleTableChange(updatedTable);
            }}
            required
          />
          <Toggle
            label={strings.SettingsPanel.constructor.activeTableLabel}
            checked={editedIsActive}
            onChange={(_, checked) => {
              const updatedTable = { ...editedTable };
              handleTableChange(updatedTable, checked ?? true);
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export const TableEditor = styled<ITableEditorProps, ITableEditorStyleProps, ITableEditorStyles>(
  TableEditorBase,
  getStyles,
  undefined,
  { scope: 'TableEditor' }
);