import { IDropdownOption } from '@fluentui/react';

export type PostgreSQLFieldType = 
  | 'varchar'
  | 'text'
  | 'integer'
  | 'bigint'
  | 'serial'
  | 'decimal'
  | 'real'
  | 'boolean'
  | 'date'
  | 'timestamptz'
  | 'uuid';


export const postgresqlFieldTypes: IDropdownOption[] = [
  { key: 'varchar', text: 'VARCHAR - Variable character' },
  { key: 'text', text: 'TEXT - Unlimited text' },
  { key: 'integer', text: 'INTEGER - 4 bytes integer' },
  { key: 'bigint', text: 'BIGINT - 8 bytes integer' },
  { key: 'serial', text: 'SERIAL - Auto-increment' },
  { key: 'decimal', text: 'DECIMAL - Exact numeric' },
  { key: 'real', text: 'REAL - Floating point' },
  { key: 'boolean', text: 'BOOLEAN - True/false' },
  { key: 'date', text: 'DATE - Date only' },
  { key: 'timestamptz', text: 'TIMESTAMP - Date and time' },
  { key: 'uuid', text: 'UUID - Unique identifier' }
];