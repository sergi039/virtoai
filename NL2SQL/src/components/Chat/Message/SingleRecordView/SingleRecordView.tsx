import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import type { ISingleRecordViewProps } from './SingleRecordView.types';
import { getStyles } from './SingleRecordView.styles';
import { DateChatUtils } from '../../../../utils/dateChatUtils';

const SingleRecordView: React.FunctionComponent<ISingleRecordViewProps> = ({
  record,
  onCellClick,
  onCellRightClick,
  isCellClickable,
  theme,
  strings,
}) => {
  const styles = getStyles({ theme });

  const capitalizeFirstLetter = (str: string) => {
    const parts = str.split(':');
    const textBeforeColon = parts[0];
    return textBeforeColon.charAt(0).toUpperCase() + textBeforeColon.slice(1);
  };

  const fields = Object.keys(record);

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: styles.containerSingleMessage }}>
      {fields.map(field => {
        const value = record[field];
        let displayValue = strings.Chat.notAvailable;

        if (value != null) {
          if (typeof value === 'object') {
            displayValue = JSON.stringify(value);
          } else {
            if (DateChatUtils.isDateLikeValue(value)) {
              displayValue = DateChatUtils.formatDateString(value.toString());
            } else {
              displayValue = value.toString();
            }
          }
        }

        const keyParts = field.split(':');
        let isClickable = false;
        let tableName = '';
        let columnName = '';

        if(keyParts.length === 2 && keyParts[1] === '.') {
          columnName = keyParts[0];
          isClickable = isCellClickable('', columnName, record);
        }
        else if (keyParts.length === 2) {
          const tableColumn = keyParts[1];
          const tableColumnParts = tableColumn.split('.');

          if (tableColumnParts.length === 2) {
            tableName = tableColumnParts[0];
            columnName = tableColumnParts[1];
            isClickable = isCellClickable(tableName, columnName, record);
          }
        }

        return (
          <Stack
            horizontal
            key={field}
            styles={{ root: styles.fieldContainerSingleMessage }}
            verticalAlign="start"
          >
            <Text
              variant="mediumPlus"
              styles={{ root: styles.fieldLabelSingleMessage }}
            >
              {capitalizeFirstLetter(field)}:
            </Text>
            {isClickable && value != null ? (
              <Text
                variant="medium"
                style={styles.redirectText}
                onClick={() => onCellClick(value, field, tableName, columnName, record)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onCellRightClick(event, value, field, tableName, columnName, record);
                }}
                styles={{ root: styles.fieldValueSingleMessage }}
              >
                {displayValue}
              </Text>
            ) : (
              <Text
                variant="medium"
                styles={{ root: styles.fieldValueSingleMessage }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onCellRightClick(event, value, field, tableName, columnName, record);
                }}
              >
                {displayValue}
              </Text>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export { SingleRecordView };
