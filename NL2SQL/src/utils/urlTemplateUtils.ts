import { IServiceTableField } from '../api/model/IServiceRegistry';

export interface IUrlTemplateResult {
  isUrlAvailable: boolean;
  url?: string;
  missingColumns?: string[];
}

export class UrlTemplateUtils {
  static checkUrlAvailability(
    serviceTableField: IServiceTableField | null,
    rowData: Record<string, any>,
    fieldKey: string
  ): IUrlTemplateResult {
    if (!serviceTableField?.urlTemplate) {
      return { isUrlAvailable: false };
    }

    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders: string[] = [];
    let match;
    
    while ((match = placeholderRegex.exec(serviceTableField.urlTemplate)) !== null) {
      placeholders.push(match[1]);
    }

    if (placeholders.length === 0) {
      return { 
        isUrlAvailable: true, 
        url: serviceTableField.urlTemplate 
      };
    }

    const tableName = UrlTemplateUtils.extractTableNameFromFieldKey(fieldKey);
    const missingColumns: string[] = [];
    let processedUrl = serviceTableField.urlTemplate;

    for (const placeholder of placeholders) {
      const columnKey = UrlTemplateUtils.findColumnKeyInRowData(rowData, tableName, placeholder);
      
      if (columnKey && rowData[columnKey] != null) {
        processedUrl = processedUrl.replace(
          new RegExp(`\\{${placeholder}\\}`, 'g'), 
          encodeURIComponent(rowData[columnKey].toString())
        );
      } else {
        missingColumns.push(placeholder);
      }
    }

    if (missingColumns.length > 0) {
      return { 
        isUrlAvailable: false, 
        missingColumns 
      };
    }

    return { 
      isUrlAvailable: true, 
      url: processedUrl 
    };
  }

  private static extractTableNameFromFieldKey(fieldKey: string): string {
    const keyParts = fieldKey.split(':');
    if (keyParts.length === 2) {
      const tableColumn = keyParts[1];
      const tableColumnParts = tableColumn.split('.');
      if (tableColumnParts.length === 2) {
        return tableColumnParts[0];
      }
    }
    return '';
  }

  private static findColumnKeyInRowData(
    rowData: Record<string, any>, 
    tableName: string, 
    columnName: string
  ): string | null {
    const exactKey = Object.keys(rowData).find(key => 
      key.endsWith(`:${tableName}.${columnName}`)
    );
    
    if (exactKey) {
      return exactKey;
    }

    const patternKey = Object.keys(rowData).find(key => {
      const keyParts = key.split(':');
      if (keyParts.length === 2) {
        const tableColumn = keyParts[1];
        const tableColumnParts = tableColumn.split('.');
        if (tableColumnParts.length === 2) {
          return tableColumnParts[0] === tableName && tableColumnParts[1] === columnName;
        }
      }
      return false;
    });

    return patternKey || null;
  }

  static getProcessedUrl(
    serviceTableField: IServiceTableField | null,
    rowData: Record<string, any>,
    fieldKey: string
  ): string | null {
    const result = UrlTemplateUtils.checkUrlAvailability(serviceTableField, rowData, fieldKey);
    return result.isUrlAvailable ? result.url || null : null;
  }
}
