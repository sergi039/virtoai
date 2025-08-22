import { RelationType } from '../api/constants/relationType';
import { CascadeType, getCascadeSQL } from '../api/constants/cascadeType';
import { ITableField, ITableSchema } from '../api/model/ITableSchema';
import { ITableRelation } from '../components/Sidebar/SettingPanel/SchemaEditor/RelationsPanel/RelationsPanel.types';
import { ISQLOperation } from '../components/Sidebar/SettingPanel/SchemaEditor/SchemaEditor.types';

export class PostgreSQLGenerator {

  static generateCreateTableSQL(table: ITableSchema): ISQLOperation {
    const columns = table.fields.map(field => this.generateColumnDefinition(field));
    const primaryKeys = table.fields.filter(f => f.isPrimaryKey).map(f => f.name);

    let sql = `CREATE TABLE "${table.name}" (\n`;
    sql += columns.join(',\n');

    if (primaryKeys.length > 0) {
      sql += `,\n  CONSTRAINT "pk_${table.name}" PRIMARY KEY (${primaryKeys.map(k => `"${k}"`).join(', ')})`;
    }

    const uniqueFields = table.fields.filter(f => f.isUnique && !f.isPrimaryKey);
    uniqueFields.forEach(field => {
      sql += `,\n  CONSTRAINT "uk_${table.name}_${field.name}" UNIQUE ("${field.name}")`;
    });

    sql += '\n);';

    if (table.description) {
      sql += `\n\nCOMMENT ON TABLE "${table.name}" IS '${table.description.replace(/'/g, "''")}';`;
    }

    table.fields.forEach(field => {
      if (field.description) {
        sql += `\nCOMMENT ON COLUMN "${table.name}"."${field.name}" IS '${field.description.replace(/'/g, "''")}';`;
      }
    });

    return {
      type: 'CREATE_TABLE',
      sql,
      description: `Create table "${table.name}" with ${table.fields.length} columns`
    };
  }

  static generateDropTableSQL(tableName: string): ISQLOperation {
    return {
      type: 'DROP_TABLE',
      sql: `DROP TABLE IF EXISTS "${tableName}" CASCADE;`,
      description: `Drop table "${tableName}"`
    };
  }

  static generateAlterTableSQL(oldTable: ITableSchema, newTable: ITableSchema): ISQLOperation[] {
    const operations: ISQLOperation[] = [];

    if (oldTable.name !== newTable.name) {
      operations.push({
        type: 'ALTER_TABLE',
        sql: `ALTER TABLE "${oldTable.name}" RENAME TO "${newTable.name}";`,
        description: `Rename table "${oldTable.name}" to "${newTable.name}"`
      });
    }

    if (oldTable.description !== newTable.description) {
      const comment = newTable.description ? `'${newTable.description.replace(/'/g, "''")}'` : 'NULL';
      operations.push({
        type: 'ALTER_TABLE',
        sql: `COMMENT ON TABLE "${newTable.name}" IS ${comment};`,
        description: `Update table "${newTable.name}" description`
      });
    }

    const oldFields = new Map(oldTable.fields.map(f => [f.name, f]));
    const newFields = new Map(newTable.fields.map(f => [f.name, f]));

    for (const [fieldName, field] of oldFields) {
      if (!newFields.has(fieldName)) {
        operations.push(this.generateDropColumnSQL(newTable.name, field));
      }
    }

    for (const [fieldName, field] of newFields) {
      if (!oldFields.has(fieldName)) {
        operations.push(this.generateAddColumnSQL(newTable.name, field));
      }
    }

    for (const [fieldName, newField] of newFields) {
      const oldField = oldFields.get(fieldName);
      if (oldField && this.isFieldChanged(oldField, newField)) {
        operations.push(...this.generateAlterColumnSQL(newTable.name, oldField, newField));
      }
    }

    return operations;
  }

  static generateAddColumnSQL(tableName: string, field: ITableField): ISQLOperation {
    const columnDef = this.generateColumnDefinition(field);
    let sql = `ALTER TABLE "${tableName}" ADD COLUMN ${columnDef};`;

    if (field.description) {
      sql += `\nCOMMENT ON COLUMN "${tableName}"."${field.name}" IS '${field.description.replace(/'/g, "''")}';`;
    }

    if (field.isUnique && !field.isPrimaryKey) {
      sql += `\nALTER TABLE "${tableName}" ADD CONSTRAINT "uk_${tableName}_${field.name}" UNIQUE ("${field.name}");`;
    }

    if (field.isPrimaryKey) {
      sql += `\nALTER TABLE "${tableName}" ADD CONSTRAINT "pk_${tableName}_${field.name}" PRIMARY KEY ("${field.name}");`;
    }

    return {
      type: 'ADD_COLUMN',
      sql,
      description: `Add column "${field.name}" to table "${tableName}"` +
        (field.isPrimaryKey ? ' as PRIMARY KEY' : '') +
        (field.isUnique ? ' as UNIQUE' : '') +
        (field.defaultValue ? ` with default ${field.defaultValue}` : '')
    };
  }

  static generateDropColumnSQL(tableName: string, field: ITableField): ISQLOperation {
    return {
      type: 'DROP_COLUMN',
      sql: `ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS "${field.name}" CASCADE;`,
      description: `Drop column "${field.name}" from table "${tableName}"`
    };
  }

  static generateAlterColumnSQL(tableName: string, oldField: ITableField, newField: ITableField): ISQLOperation[] {
    const operations: ISQLOperation[] = [];

    if (oldField.name !== newField.name) {
      operations.push({
        type: 'ALTER_COLUMN',
        sql: `ALTER TABLE "${tableName}" RENAME COLUMN "${oldField.name}" TO "${newField.name}";`,
        description: `Rename column "${oldField.name}" to "${newField.name}"`
      });
    }

    if (oldField.type !== newField.type || oldField.maxLength !== newField.maxLength) {
      const newType = this.getPostgreSQLType(newField);
      operations.push({
        type: 'ALTER_COLUMN',
        sql: `ALTER TABLE "${tableName}" ALTER COLUMN "${newField.name}" TYPE ${newType};`,
        description: `Change column "${newField.name}" type to ${newType}`
      });
    }

    if (oldField.isRequired !== newField.isRequired) {
      const action = newField.isRequired ? 'SET NOT NULL' : 'DROP NOT NULL';
      operations.push({
        type: 'ALTER_COLUMN',
        sql: `ALTER TABLE "${tableName}" ALTER COLUMN "${newField.name}" ${action};`,
        description: `${newField.isRequired ? 'Add' : 'Remove'} NOT NULL constraint on "${newField.name}"`
      });
    }

    if (oldField.defaultValue !== newField.defaultValue) {
      if (newField.defaultValue) {
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" ALTER COLUMN "${newField.name}" SET DEFAULT ${newField.defaultValue};`,
          description: `Set default value for "${newField.name}"`
        });
      } else {
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" ALTER COLUMN "${newField.name}" DROP DEFAULT;`,
          description: `Remove default value for "${newField.name}"`
        });
      }
    }

    if (oldField.description !== newField.description) {
      const comment = newField.description ? `'${newField.description.replace(/'/g, "''")}'` : 'NULL';
      operations.push({
        type: 'ALTER_COLUMN',
        sql: `COMMENT ON COLUMN "${tableName}"."${newField.name}" IS ${comment};`,
        description: `Update comment for column "${newField.name}"`
      });
    }

    if (oldField.isUnique !== newField.isUnique) {
      if (newField.isUnique && !newField.isPrimaryKey) {
        const constraintName = `uk_${tableName}_${newField.name}`;
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" UNIQUE ("${newField.name}");`,
          description: `Add UNIQUE constraint on "${newField.name}"`
        });
      } else if (!newField.isUnique && !oldField.isPrimaryKey) {
        const constraintName = `uk_${tableName}_${newField.name}`;
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraintName}";`,
          description: `Remove UNIQUE constraint from "${newField.name}"`
        });
      }
    }

    if (oldField.isPrimaryKey !== newField.isPrimaryKey) {
      if (newField.isPrimaryKey) {
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "pk_${tableName}";`,
          description: `Drop existing primary key constraint from table "${tableName}"`
        });
        
        const constraintName = `pk_${tableName}_${newField.name}`;
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" PRIMARY KEY ("${newField.name}");`,
          description: `Add PRIMARY KEY constraint on "${newField.name}"`
        });
        
        if (oldField.isUnique) {
          const uniqueConstraintName = `uk_${tableName}_${newField.name}`;
          operations.push({
            type: 'ALTER_COLUMN',
            sql: `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${uniqueConstraintName}";`,
            description: `Remove redundant UNIQUE constraint from "${newField.name}" (PRIMARY KEY is unique by default)`
          });
        }
      } else if (!newField.isPrimaryKey && oldField.isPrimaryKey) {
        const constraintName = `pk_${tableName}_${newField.name}`;
        operations.push({
          type: 'ALTER_COLUMN',
          sql: `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraintName}";`,
          description: `Remove PRIMARY KEY constraint from "${newField.name}"`
        });

        if (newField.isUnique) {
          const uniqueConstraintName = `uk_${tableName}_${newField.name}`;
          operations.push({
            type: 'ALTER_COLUMN',
            sql: `ALTER TABLE "${tableName}" ADD CONSTRAINT "${uniqueConstraintName}" UNIQUE ("${newField.name}");`,
            description: `Add UNIQUE constraint on "${newField.name}"`
          });
        }
      }
    }

    return operations;
  }

  private static generateColumnDefinition(field: ITableField): string {
    const type = this.getPostgreSQLType(field);
    const notNull = field.isRequired ? ' NOT NULL' : '';
    const defaultValue = field.defaultValue ? ` DEFAULT ${field.defaultValue}` : '';

    return `  "${field.name}" ${type}${notNull}${defaultValue}`;
  }

  private static getPostgreSQLType(field: ITableField): string {
    switch (field.type) {
      case 'varchar':
        return field.maxLength ? `VARCHAR(${field.maxLength})` : 'VARCHAR';
      case 'decimal':
        if (field.precision && field.scale !== undefined) {
          return `DECIMAL(${field.precision}, ${field.scale})`;
        } else if (field.precision) {
          return `DECIMAL(${field.precision})`;
        }
        return 'DECIMAL';
      default:
        return field.type.toUpperCase();
    }
  }

  private static isFieldChanged(oldField: ITableField, newField: ITableField): boolean {
    return (
      oldField.name !== newField.name ||
      oldField.type !== newField.type ||
      oldField.isRequired !== newField.isRequired ||
      oldField.defaultValue !== newField.defaultValue ||
      oldField.maxLength !== newField.maxLength ||
      oldField.precision !== newField.precision ||
      oldField.scale !== newField.scale ||
      oldField.description !== newField.description ||
      oldField.isUnique !== newField.isUnique ||
      oldField.isPrimaryKey !== newField.isPrimaryKey
    );
  }

  static logOperation(operation: ISQLOperation): void {
    console.group(`🔧 PostgreSQL Operation: ${operation.type}`);
    console.log(`📝 Description: ${operation.description}`);
    console.log(`💾 SQL:`);
    console.log(operation.sql);
    console.groupEnd();
  }

  static logOperations(operations: ISQLOperation[]): void {
    if (operations.length === 0) {
      console.log('ℹ️ No SQL operations generated - no changes detected');
      return;
    }

    console.group(`🔧 PostgreSQL Operations (${operations.length})`);
    operations.forEach((op, index) => {
      console.log(`\n--- Operation ${index + 1}: ${op.type} ---`);
      console.log(`📝 Description: ${op.description}`);
      console.log(`💾 SQL:\n${op.sql}`);
    });
    console.groupEnd();
  }

  static generateCreateForeignKeySQL(relation: ITableRelation): ISQLOperation {
    const constraintName = relation.constraintName ||
      `fk_${relation.sourceTableName}_${relation.targetTableName}_${Date.now()}`;

    if (relation.relationType === RelationType.ManyToMany) {
      return {
        type: 'CREATE_FOREIGN_KEY',
        sql: `-- Many-to-many relation handled separately`,
        description: `Many-to-many relation between ${relation.sourceTableName} and ${relation.targetTableName} (handled via junction table)`
      };
    }

    let sql = `ALTER TABLE "${relation.sourceTableName}" `;
    sql += `ADD CONSTRAINT "${constraintName}" `;
    sql += `FOREIGN KEY ("${relation.sourceColumnName}") `;
    sql += `REFERENCES "${relation.targetTableName}" ("${relation.targetColumnName}")`;

    const onDeleteAction = relation.onDeleteAction && relation.onDeleteAction !== CascadeType.NONE 
      ? getCascadeSQL(relation.onDeleteAction) 
      : null;
    const onUpdateAction = relation.onUpdateAction && relation.onUpdateAction !== CascadeType.NONE 
      ? getCascadeSQL(relation.onUpdateAction) 
      : null;

    if (onDeleteAction || onUpdateAction) {
      if (onDeleteAction) {
        sql += ` ON DELETE ${onDeleteAction}`;
      }
      if (onUpdateAction) {
        sql += ` ON UPDATE ${onUpdateAction}`;
      }
    } else {
      if (relation.relationType === RelationType.OneToOne) {
        sql += ` ON DELETE RESTRICT ON UPDATE CASCADE`;
      } else if (relation.relationType === RelationType.OneToMany) {
        sql += ` ON DELETE CASCADE ON UPDATE CASCADE`;
      }
    }

    sql += ';';

    return {
      type: 'CREATE_FOREIGN_KEY',
      sql,
      description: `Create foreign key constraint "${constraintName}" from ${relation.sourceTableName}.${relation.sourceColumnName} to ${relation.targetTableName}.${relation.targetColumnName}` +
        (onDeleteAction ? ` with ON DELETE ${onDeleteAction}` : '') +
        (onUpdateAction ? ` with ON UPDATE ${onUpdateAction}` : '')
    };
  }

  static generateDropForeignKeySQL(tableName: string, constraintName: string): ISQLOperation {
    return {
      type: 'DROP_FOREIGN_KEY',
      sql: `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraintName}";`,
      description: `Drop foreign key constraint "${constraintName}" from table "${tableName}"`
    };
  }

  static generateCreateIndexForForeignKeySQL(relation: ITableRelation): ISQLOperation {
    const indexName = `idx_${relation.sourceTableName}_${relation.sourceColumnName}`;

    const sql = `CREATE INDEX IF NOT EXISTS "${indexName}" ON "${relation.sourceTableName}" ("${relation.sourceColumnName}");`;

    return {
      type: 'CREATE_INDEX',
      sql,
      description: `Create index "${indexName}" on ${relation.sourceTableName}.${relation.sourceColumnName} for foreign key performance`
    };
  }

  static generateRelationSQL(relation: ITableRelation): ISQLOperation[] {
    const operations: ISQLOperation[] = [];

    operations.push(this.generateCreateForeignKeySQL(relation));

    operations.push(this.generateCreateIndexForForeignKeySQL(relation));

    return operations;
  }

  static generateValidateRelationSQL(relation: ITableRelation): ISQLOperation[] {
    const operations: ISQLOperation[] = [];

    operations.push({
      type: 'VALIDATE',
      sql: `SELECT 1 FROM information_schema.tables WHERE table_name = '${relation.sourceTableName}' AND table_schema = 'public';`,
      description: `Validate source table "${relation.sourceTableName}" exists`
    });

    operations.push({
      type: 'VALIDATE',
      sql: `SELECT 1 FROM information_schema.tables WHERE table_name = '${relation.targetTableName}' AND table_schema = 'public';`,
      description: `Validate target table "${relation.targetTableName}" exists`
    });

    operations.push({
      type: 'VALIDATE',
      sql: `SELECT 1 FROM information_schema.columns WHERE table_name = '${relation.sourceTableName}' AND column_name = '${relation.sourceColumnName}' AND table_schema = 'public';`,
      description: `Validate source column "${relation.sourceTableName}.${relation.sourceColumnName}" exists`
    });

    operations.push({
      type: 'VALIDATE',
      sql: `SELECT 1 FROM information_schema.columns WHERE table_name = '${relation.targetTableName}' AND column_name = '${relation.targetColumnName}' AND table_schema = 'public';`,
      description: `Validate target column "${relation.targetTableName}.${relation.targetColumnName}" exists`
    });

    operations.push({
      type: 'VALIDATE',
      sql: `
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = '${relation.targetTableName}' 
        AND kcu.column_name = '${relation.targetColumnName}'
        AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
        AND tc.table_schema = 'public';`,
      description: `Validate target column "${relation.targetTableName}.${relation.targetColumnName}" has PRIMARY KEY or UNIQUE constraint`
    });

    return operations;
  }

  static generateManyToManyRelationSQL(relation: ITableRelation): ISQLOperation[] {
    const operations: ISQLOperation[] = [];
    const junctionTableName = relation.junctionTableName ||
      `${relation.sourceTableName}_${relation.targetTableName}_junction`;

    const createJunctionTableSQL = `CREATE TABLE "${junctionTableName}" (
      "${relation.sourceTableName}_id" INTEGER NOT NULL,
      "${relation.targetTableName}_id" INTEGER NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT "pk_${junctionTableName}_composite" 
        PRIMARY KEY ("${relation.sourceTableName}_id", "${relation.targetTableName}_id")
    );`;

    operations.push({
      type: 'CREATE_TABLE',
      sql: createJunctionTableSQL,
      description: `Create junction table "${junctionTableName}" for many-to-many relation`
    });

    const onDeleteAction = relation.onDeleteAction && relation.onDeleteAction !== CascadeType.NONE 
      ? getCascadeSQL(relation.onDeleteAction) 
      : 'CASCADE';
    const onUpdateAction = relation.onUpdateAction && relation.onUpdateAction !== CascadeType.NONE 
      ? getCascadeSQL(relation.onUpdateAction) 
      : 'CASCADE';

    const sourceFKConstraint = `fk_${junctionTableName}_${relation.sourceTableName}`;
    const sourceFKSQL = `ALTER TABLE "${junctionTableName}" 
      ADD CONSTRAINT "${sourceFKConstraint}" 
      FOREIGN KEY ("${relation.sourceTableName}_id") 
      REFERENCES "${relation.sourceTableName}" ("${relation.sourceColumnName}")
      ON DELETE ${onDeleteAction} ON UPDATE ${onUpdateAction};`;

    operations.push({
      type: 'CREATE_FOREIGN_KEY',
      sql: sourceFKSQL,
      description: `Create foreign key from junction table to ${relation.sourceTableName}`
    });

    const targetFKConstraint = `fk_${junctionTableName}_${relation.targetTableName}`;
    const targetFKSQL = `ALTER TABLE "${junctionTableName}" 
      ADD CONSTRAINT "${targetFKConstraint}" 
      FOREIGN KEY ("${relation.targetTableName}_id") 
      REFERENCES "${relation.targetTableName}" ("${relation.targetColumnName}")
      ON DELETE ${onDeleteAction} ON UPDATE ${onUpdateAction};`;

    operations.push({
      type: 'CREATE_FOREIGN_KEY',
      sql: targetFKSQL,
      description: `Create foreign key from junction table to ${relation.targetTableName}`
    });

    const sourceIndexSQL = `CREATE INDEX "idx_${junctionTableName}_${relation.sourceTableName}" 
    ON "${junctionTableName}" ("${relation.sourceTableName}_id");`;

    operations.push({
      type: 'CREATE_INDEX',
      sql: sourceIndexSQL,
      description: `Create index on junction table for ${relation.sourceTableName}_id`
    });

    const targetIndexSQL = `CREATE INDEX "idx_${junctionTableName}_${relation.targetTableName}" 
    ON "${junctionTableName}" ("${relation.targetTableName}_id");`;

    operations.push({
      type: 'CREATE_INDEX',
      sql: targetIndexSQL,
      description: `Create index on junction table for ${relation.targetTableName}_id`
    });
    
    return operations;
  }

  static generateDropManyToManyRelationSQL(relation: ITableRelation): ISQLOperation {
    const junctionTableName = relation.junctionTableName ||
      `${relation.sourceTableName}_${relation.targetTableName}_junction`;

    return {
      type: 'DROP_TABLE',
      sql: `DROP TABLE IF EXISTS "${junctionTableName}" CASCADE;`,
      description: `Drop junction table "${junctionTableName}" for many-to-many relation`
    };
  }

  static checkRelationExists(
    sourceTableName: string,
    sourceColumnName: string,
    targetTableName: string,
    targetColumnName: string,
    existingRelations: any[]
  ): boolean {
    return existingRelations.some(relation =>
      (relation.sourceTableName === sourceTableName &&
        relation.sourceColumnName === sourceColumnName &&
        relation.targetTableName === targetTableName &&
        relation.targetColumnName === targetColumnName) ||
      (relation.sourceTableName === targetTableName &&
        relation.sourceColumnName === targetColumnName &&
        relation.targetTableName === sourceTableName &&
        relation.targetColumnName === sourceColumnName)
    );
  }
}
