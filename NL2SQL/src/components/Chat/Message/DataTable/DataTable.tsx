import * as React from 'react';
import {
  Stack,
  Text,
  DetailsList,
  IColumn,
  DetailsListLayoutMode,
  DefaultButton,
  IconButton,
  styled,
} from '@fluentui/react';
import type { IDataTableProps, IDataTableStyleProps, IDataTableStyles } from './DataTable.types';
import { getClassNames, getStyles } from './DataTable.styles';
import { DateChatUtils } from '../../../../utils/dateChatUtils';

const DataTableBase: React.FC<IDataTableProps> = ({
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onCellClick,
  onCellRightClick,
  isCellClickable,
  theme,
  strings,
}) => {
  const styleNames = getStyles({ theme });
  const classNames = getClassNames(styleNames);

  const capitalizeFirstLetter = (str: string) => {
    const parts = str.split(':');
    const textBeforeColon = parts[0];
    return textBeforeColon.charAt(0).toUpperCase() + textBeforeColon.slice(1);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentItems = data.slice(startIndex, endIndex);

  const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
  const containerWidth = 1200;
  const minColumnWidth = 100;

  const columnWidth = Math.floor(containerWidth / allKeys.length);
  const finalColumnWidth = Math.max(columnWidth, minColumnWidth);

  const columns: IColumn[] = allKeys.map(key => {
    return {
      key,
      name: capitalizeFirstLetter(key),
      fieldName: key,
      minWidth: finalColumnWidth,
      maxWidth: finalColumnWidth,
      isResizable: true,
      onRender: (item: Record<string, any>) => {
        const value = item[key];

        if (value == null) {
          return strings.Chat.notAvailable;
        }

        const keyParts = key.split(':');
        let displayValue = value.toString();

        if (DateChatUtils.isDateLikeValue(value)) {
          displayValue = DateChatUtils.formatDateString(value.toString());
        }

        if (keyParts[1] == '.' && keyParts.length === 2) {
          const columnName = keyParts[0];

          return (
            <Text
              className={classNames.clickableCell}
              onContextMenu={(event) => {
                event.preventDefault();
                onCellRightClick(event, value, key, '', columnName, item);
              }}
            >
              {displayValue}
            </Text>
          );
        }
        else if (keyParts.length === 2) {
          const tableColumn = keyParts[1];
          const tableColumnParts = tableColumn.split('.');

          if (tableColumnParts.length === 2) {
            const tableName = tableColumnParts[0];
            const columnName = tableColumnParts[1];

            const isClickable = isCellClickable(tableName, columnName, item);

            if (isClickable && value != null) {
              return (
                <Text
                  className={classNames.redirectText}
                  onClick={() => onCellClick(value, key, tableName, columnName, item)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    onCellRightClick(event, value, key, tableName, columnName, item);
                  }}
                >
                  {displayValue}
                </Text>
              );
            }

            return (
              <span
                className={classNames.clickableCell}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onCellRightClick(event, value, key, tableName, columnName, item);
                }}
              >
                {displayValue}
              </span>
            );
          }
        }

        return (
          <span
            className={classNames.clickableCell}
            onContextMenu={(event) => {
              event.preventDefault();
              onCellRightClick(event, value, key, undefined, undefined, item);
            }}
          >
            {displayValue}
          </span>
        );
      },
    };
  });

  const renderPageNumbers = (currentPage: number, totalPages: number) => {
    const pagesToShow: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      pagesToShow.push(1);

      if (currentPage <= 4) {
        pagesToShow.push(2, 3, 4, 5, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pagesToShow.push('ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pagesToShow.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return (
      <Stack horizontal tokens={{ childrenGap: 2 }}>
        {pagesToShow.map((page, idx) =>
          page === 'ellipsis' ? (
            <Text key={`ellipsis-${idx}`} style={{ lineHeight: '28px', fontSize: '12px', padding: '0 4px' }}>...</Text>
          ) : (
            <DefaultButton
              key={`page-${page}`}
              text={page.toString()}
              checked={page === currentPage}
              styles={styleNames.pageButton}
              onClick={() => onPageChange(page)}
            />
          )
        )}
      </Stack>
    );
  };

  return (
    <div>
      <div className={classNames.tableContainer}>
        <DetailsList
          items={currentItems}
          columns={columns}
          setKey={`page-${currentPage}`}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={0}
          styles={styleNames.detailsList}
        />
      </div>
      {totalPages > 1 && (
        <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginTop: '10px' } }}>
          <Text>
            {strings.Chat.shown} {startIndex + 1}-{endIndex} {strings.Chat.from} {data.length}
          </Text>
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <IconButton
              iconProps={{ iconName: 'ChevronLeft' }}
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            />
            {renderPageNumbers(currentPage, totalPages)}
            <IconButton
              iconProps={{ iconName: 'ChevronRight' }}
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            />
          </Stack>
        </Stack>
      )}
    </div>
  );
};

export const DataTable = styled<IDataTableProps, IDataTableStyleProps, IDataTableStyles>(
  DataTableBase,
  getStyles,
  undefined,
  { scope: 'DataTable' }
);
