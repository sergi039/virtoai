import React, { useState, useEffect, useCallback } from 'react';
import { ContextualMenu, IContextualMenuItem, Spinner, SpinnerSize } from '@fluentui/react';
import type { IFluentContextMenuProps } from './ContextMenu.types';
import toast from 'react-hot-toast';
import { useNL2SQLStore } from '../../../../stores/useNL2SQLStore';
import strings from '../../../../Ioc/en-us';
import { UrlTemplateUtils } from '../../../../utils/urlTemplateUtils';
import { DateChatUtils } from '../../../../utils/dateChatUtils';
import { IRequestGenerateFieldContext } from '../../../../api/model';

const FluentContextMenu: React.FunctionComponent<IFluentContextMenuProps> = ({
  isVisible,
  target,
  cellValue,
  columnName,
  tableName,
  rowData,
  onDismiss,
  theme,
}) => {
  const { insertTextToInput, serviceTables, serviceTableFields, generateFieldContext, currentChat } = useNL2SQLStore();

  const [isGeneratingAIContext, setIsGeneratingAIContext] = useState(false);
  const [aiGeneratedItems, setAiGeneratedItems] = useState<string[]>([]);
  const [aiContextCache, setAiContextCache] = useState<Map<string, string[]>>(new Map());

  const formatValueForDisplay = useCallback((value: any): string => {
    if (value == null) {
      return strings.Chat.notAvailable;
    }

    let displayValue = value.toString();

    if (DateChatUtils.isDateLikeValue(value)) {
      displayValue = DateChatUtils.formatDateString(value.toString());
    }

    return displayValue;
  }, []);

  const getCacheKey = useCallback(() => {
    if (!rowData) return `${tableName}_${columnName}_${cellValue}`;

    const rowDataString = Object.entries(rowData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('|');

    return `${tableName}_${columnName}_${rowDataString}`;
  }, [tableName, columnName, cellValue, rowData]);

  const convertRowDataToArray = useCallback((rowData: Record<string, any>) => {
    return Object.entries(rowData).map(([key, value]) => ({
      key,
      value: value
    }));
  }, []);

  const replaceVariablesInText = useCallback((text: string, rowData: Record<string, any>) => {
    let result = text;

    const variableRegex = /\{([^}]+)\}/g;
    const matches = [...text.matchAll(variableRegex)];

    for (const match of matches) {
      const fullVariable = match[0];
      const variableName = match[1];

      if (variableName === 'value') continue;

      let foundValue = null;

      const exactMatchKey = Object.keys(rowData).find(key => {
        const keyParts = key.split(':');
        if (keyParts.length > 1) {
          return keyParts[0] === variableName;
        }
        return key === variableName;
      });

      if (exactMatchKey) {
        foundValue = rowData[exactMatchKey];
      } else {
        const fieldName = variableName.includes('.') ?
          variableName.split('.').pop() : variableName;

        const fieldMatchKey = Object.keys(rowData).find(key => {
          const keyParts = key.split(':');
          if (keyParts.length > 1) {
            const tableColumn = keyParts[0];
            const columnParts = tableColumn.split('.');
            const columnName = columnParts[columnParts.length - 1];
            return columnName === fieldName;
          }
          return key === fieldName;
        });

        if (fieldMatchKey) {
          foundValue = rowData[fieldMatchKey];
        }
      }

      if (foundValue !== null) {
        const formattedValue = formatValueForDisplay(foundValue);
        result = result.replace(new RegExp(fullVariable.replace(/[{}]/g, '\\$&'), 'g'), formattedValue);
      }
    }

    return result;
  }, [cellValue, formatValueForDisplay]);

  const cleanAIGeneratedItems = useCallback((items: string[]) => {
    return items.map(item => {
      let cleaned = item.replace(/^\d+\.\s*/, '');

      cleaned = cleaned.replace(/^"(.*)"$/, '$1');

      cleaned = cleaned.replace(/\\"/g, '"');

      return cleaned.trim();
    });
  }, []);

  const generateAIContextItems = useCallback(async (isFieldExist: boolean) => {
    if (!columnName || cellValue == null || !rowData) return;

    const cacheKey = getCacheKey();

    if (aiContextCache.has(cacheKey)) {
      setAiGeneratedItems(aiContextCache.get(cacheKey) || []);
      return;
    }

    setIsGeneratingAIContext(true);
    try {
      const requestToAi: IRequestGenerateFieldContext = {
        tableName: isFieldExist ? tableName || '' : '',
        fieldName: columnName,
        chatId: currentChat?.id || 0,
        isFieldExist: isFieldExist,
        rowData: convertRowDataToArray(rowData)
      };

      const generatedItems = await generateFieldContext(requestToAi);

      const cleanedItems = cleanAIGeneratedItems(generatedItems);

      setAiGeneratedItems(cleanedItems);

      setAiContextCache(prev => new Map(prev).set(cacheKey, cleanedItems));

    } catch (error) {
      toast.error('Failed to generate AI context suggestions');
      setAiGeneratedItems([]);
    } finally {
      setIsGeneratingAIContext(false);
    }
  }, [tableName, columnName, cellValue, rowData, generateFieldContext, getCacheKey, aiContextCache, cleanAIGeneratedItems, convertRowDataToArray]);

  useEffect(() => {
    if (isVisible && rowData) {
      const table = serviceTables?.find(table => table.name === tableName);

      if (table) {
        const field = serviceTableFields?.find(field =>
          field.serviceTableId === table.id && field.name === columnName
        );

        if (field?.isAiContextGenerationEnabled === true) {
          generateAIContextItems(true);
        } else {
          setAiGeneratedItems([]);
          setIsGeneratingAIContext(false);
        }
      } else {
        generateAIContextItems(false);
      }
    }

    if (!isVisible) {
      setIsGeneratingAIContext(false);
    }
  }, [isVisible, tableName, columnName, rowData, serviceTables, serviceTableFields, generateAIContextItems]);

  const handleDismiss = useCallback(() => {
    setIsGeneratingAIContext(false);
    onDismiss();
  }, [onDismiss]);

  const handleOpenUrl = () => {
    if (tableName && columnName && rowData) {
      const serviceTableField = serviceTableFields?.find(field =>
        field.serviceTableId === findTableByName()?.id && field.name === columnName
      );

      if (serviceTableField?.urlTemplate) {
        const fieldKey = Object.keys(rowData).find(key => key.endsWith(`:${tableName}.${columnName}`)) || '';
        const processedUrl = UrlTemplateUtils.getProcessedUrl(serviceTableField, rowData, fieldKey);

        if (processedUrl) {
          window.open(processedUrl, '_blank');
        } else {
          toast.error(strings.Chat.ContextMenu.urlGenerationFailed);
        }
      }
    }
    handleDismiss();
  };

  const handleCopyValue = () => {
    if (cellValue != null) {
      const formattedValue = formatValueForDisplay(cellValue);
      navigator.clipboard.writeText(formattedValue);
      toast.success(strings.Chat.ContextMenu.valueCopied);
    }
    handleDismiss();
  };

  const handleContextMenuItemClick = (itemName: string) => {
    if (!rowData) return;

    const processedText = replaceVariablesInText(itemName, rowData);
    insertTextToInput(processedText);
    handleDismiss();
  };

  const findTableByName = () => {
    if (!tableName || !serviceTables) return null;
    return serviceTables.find(table => table.name === tableName) || null;
  };

  const getFieldContextMenuItems = () => {
    if (isGeneratingAIContext) {
      return [{
        key: 'ai-loading',
        text: 'Generating AI suggestions...',
        iconProps: { iconName: 'Sync' },
        disabled: true,
        onRender: () => (
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
            <Spinner size={SpinnerSize.xSmall} style={{ marginRight: '8px' }} />
            <span>Generating AI suggestions...</span>
          </div>
        ),
      }];
    }

    return aiGeneratedItems.map((item, index) => ({
      key: `ai-${index}`,
      text: replaceVariablesInText(item, rowData || {}),
      iconProps: { iconName: 'Lightbulb' },
      onClick: () => handleContextMenuItemClick(item),
    }));
  };


  const getUrlAvailability = (): { isAvailable: boolean; url?: string } => {
    if (!tableName || !columnName || !rowData) {
      return { isAvailable: false };
    }

    const serviceTableField = serviceTableFields?.find(field =>
      field.serviceTableId === findTableByName()?.id && field.name === columnName
    );

    if (!serviceTableField?.urlTemplate) {
      return { isAvailable: false };
    }

    const fieldKey = Object.keys(rowData).find(key => key.endsWith(`:${tableName}.${columnName}`)) || '';
    const result = UrlTemplateUtils.checkUrlAvailability(serviceTableField, rowData, fieldKey);

    return {
      isAvailable: result.isUrlAvailable,
      url: result.url
    };
  };

  const urlAvailability = getUrlAvailability();

  const baseMenuItems: IContextualMenuItem[] = [
    {
      key: 'copy',
      text: strings.Chat.ContextMenu.copyValue,
      iconProps: { iconName: 'Copy' },
      onClick: handleCopyValue,
    },
  ];

  if (urlAvailability.isAvailable) {
    baseMenuItems.push({
      key: 'openUrl',
      text: strings.Chat.ContextMenu.openUrl,
      iconProps: { iconName: 'NavigateExternalInline' },
      onClick: handleOpenUrl,
    });
  }

  baseMenuItems.push({
    key: 'divider1',
    itemType: 1,
  });

  const fieldContextItems = getFieldContextMenuItems();

  const dynamicMenuItems: IContextualMenuItem[] = fieldContextItems.length > 0 ? [
    {
      key: 'divider2',
      itemType: 1,
    },
    ...fieldContextItems.map((item: any) => {
      if (item.key?.startsWith('ai-')) {
        return item;
      }

      return {
        key: `context-${item.id}`,
        text: replaceVariablesInText(item.name, rowData || {}),
        iconProps: { iconName: 'Lightbulb' },
        onClick: () => handleContextMenuItemClick(item.name),
      };
    })
  ] : [];

  const menuItems = [...baseMenuItems, ...dynamicMenuItems];

  if (!isVisible || !target) {
    return null;
  }

  return (
    <ContextualMenu
      items={menuItems}
      hidden={!isVisible}
      target={target}
      onDismiss={handleDismiss}
      theme={theme}
    />
  );
};

export const ContextMenu = FluentContextMenu;
