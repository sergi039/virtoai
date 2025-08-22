import type { IStyle, IStyleFunctionOrObject, ITheme, IPanelStyles } from '@fluentui/react';

export interface ISchemaEditorProps {
  theme?: ITheme;
  selectedService?: string;
  styles?: IStyleFunctionOrObject<ISchemaEditorStyleProps, ISchemaEditorStyles>;
}

export type ISchemaEditorStyleProps = Pick<ISchemaEditorProps, 'theme'>;

export interface ISchemaEditorStyles {
  root: IStyle;
  panel: Partial<IPanelStyles>;
}

export interface ISQLOperation {
  type: 'CREATE_TABLE' | 'ALTER_TABLE' | 'DROP_TABLE' | 'ADD_COLUMN' | 'ALTER_COLUMN' | 'DROP_COLUMN' | 
        'CREATE_FOREIGN_KEY' | 'DROP_FOREIGN_KEY' | 'CREATE_INDEX' | 'VALIDATE';
  sql: string;
  description: string;
}
