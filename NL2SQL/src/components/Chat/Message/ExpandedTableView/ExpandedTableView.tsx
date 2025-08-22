import * as React from 'react';
import { useState } from 'react';
import {
  styled,
  DetailsList,
  IColumn,
  DetailsListLayoutMode,
  Stack,
  Text,
  DefaultButton,
  IconButton,
  Panel,
  PanelType,
} from '@fluentui/react';
import type { IExpandedTableViewProps, IExpandedTableViewStyleProps, IExpandedTableViewStyles } from './ExpandedTableView.types';
import { getStyles, getClassNames } from './ExpandedTableView.styles';
import strings from '../../../../Ioc/en-us';

const ExpandedTableViewBase: React.FunctionComponent<IExpandedTableViewProps> = ({
  isOpen,
  data,
  onClose,
  onCellClick,
  isCellClickable,
  theme,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const styleProps: IExpandedTableViewStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);

  const capitalizeFirstLetter = (str: string) => {
    const parts = str.split(':');
    const textBeforeColon = parts[0];
    return textBeforeColon.charAt(0).toUpperCase() + textBeforeColon.slice(1);
  };

  const renderPageNumbers = (currentPage: number, totalPages: number) => {
    const pagesToShow: (number | 'ellipsis')[] = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      pagesToShow.push(1);

      if (currentPage <= 5) {
        pagesToShow.push(2, 3, 4, 5, 6, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 4) {
        pagesToShow.push('ellipsis', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pagesToShow.push('ellipsis', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, 'ellipsis', totalPages);
      }
    }

    return (
      <Stack horizontal tokens={{ childrenGap: 4 }}>
        {pagesToShow.map((page, idx) =>
          page === 'ellipsis' ? (
            <Text key={`ellipsis-${idx}`} style={{ lineHeight: '32px', fontSize: '12px', padding: '0 8px' }}>...</Text>
          ) : (
            <DefaultButton
              key={`page-${page}`}
              text={page.toString()}
              checked={page === currentPage}
              styles={styleNames.pageButton}
              onClick={() => setCurrentPage(page)}
            />
          )
        )}
      </Stack>
    );
  };

  if (!isOpen) {
    return null;
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentItems = data.slice(startIndex, endIndex);

  const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
  
  const containerWidth = 1200; 
  const minColumnWidth = 100;
  
  const columnWidth = Math.floor(containerWidth / allKeys.length);
  const finalColumnWidth = Math.max(columnWidth, minColumnWidth);

  const columns: IColumn[] = allKeys.map(key => ({
    key,
    name: capitalizeFirstLetter(key),
    fieldName: key,
    minWidth: finalColumnWidth,
    maxWidth: finalColumnWidth,
    isResizable: true, 
    onRender: (item: Record<string, any>) => {
      const value = item[key];

      const keyParts = key.split(':');

      if (keyParts.length === 2) {
        const tableColumn = keyParts[1];
        const tableColumnParts = tableColumn.split('.');

        if (tableColumnParts.length === 2) {
          const tableName = tableColumnParts[0];
          const columnName = tableColumnParts[1];

          const isClickable = isCellClickable && isCellClickable(tableName, columnName, item);

          if (isClickable && value != null) {
            return (
              <Text
                className={classNames.redirectText}
                onClick={() => onCellClick && onCellClick(value, key, tableName, columnName, item)}
              >
                {value.toString()}
              </Text>
            );
          }
        }
      }

      return (
        <span style={{ wordBreak: 'break-word' }}>
          {value != null ? value.toString() : strings.Chat.notAvailable}
        </span>
      );
    },
  }));

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onClose}
      type={PanelType.large}
      isLightDismiss={true}
      headerText="Expanded Table View"
      styles={styleNames.panel}
    >
      <div className={classNames.content}>
        <div className={classNames.tableContainer}>
          <DetailsList
            items={currentItems}
            columns={columns}
            setKey={`expanded-page-${currentPage}`}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={0}
            styles={styleNames.detailsList}
          />
        </div>
        
        {totalPages > 1 && (
          <div className={classNames.paginationContainer}>
            <Text className={classNames.pageInfo}>
              {strings.Chat.shown} {startIndex + 1}-{endIndex} {strings.Chat.from} {data.length}
            </Text>
            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
              <IconButton
                iconProps={{ iconName: 'ChevronLeft' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              />
              {renderPageNumbers(currentPage, totalPages)}
              <IconButton
                iconProps={{ iconName: 'ChevronRight' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              />
            </Stack>
          </div>
        )}
      </div>
    </Panel>
  );
};

export const ExpandedTableView = styled<IExpandedTableViewProps, IExpandedTableViewStyleProps, IExpandedTableViewStyles>(
  ExpandedTableViewBase,
  getStyles,
  undefined,
  { scope: 'ExpandedTableView' }
);
