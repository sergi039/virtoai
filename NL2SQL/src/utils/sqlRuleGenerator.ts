import { JoinType } from '../api/constants/joinType';
import { RelationType } from '../api/constants/relationType';
import { ISqlGenerationRule } from '../api/model/ISqlGenerationRule';

export interface ISqlRuleGenerationParams {
    sourceTableName: string;
    targetTableName: string;
    sourceColumnName: string;
    targetColumnName: string;
    joinType: JoinType;
    serviceTableId: number;
    relationType: RelationType;
    junctionTableName?: string;
    isRequiredJoin?: boolean;
}

export class SqlRuleGenerator {
    static generateJoinRule(params: ISqlRuleGenerationParams): ISqlGenerationRule {
        const {
            sourceTableName,
            targetTableName,
            sourceColumnName,
            targetColumnName,
            joinType,
            serviceTableId,
            relationType,
            junctionTableName,
            isRequiredJoin = true
        } = params;

        let ruleText: string;

        if (isRequiredJoin) {
            if (relationType === RelationType.ManyToMany && junctionTableName) {
                ruleText = `Always ${joinType} JOIN ${junctionTableName} ON ${sourceTableName}.${sourceColumnName} = ${junctionTableName}.${sourceColumnName} then ${joinType} JOIN ${targetTableName} ON ${junctionTableName}.${targetColumnName} = ${targetTableName}.${targetColumnName} when selecting from ${sourceTableName}; if specific fields are requested, select only those; otherwise, include all fields from ${sourceTableName} and ${targetTableName}`;
            } else if (joinType === JoinType.CROSS) {
                ruleText = `Always CROSS JOIN ${targetTableName} with ${sourceTableName} when selecting from ${sourceTableName}; if specific fields are requested, select only those; otherwise, include all fields from both tables`;
            } else {
                ruleText = `Always ${joinType} JOIN ${targetTableName} with ${sourceTableName} their link ${targetTableName}.${targetColumnName} = ${sourceTableName}.${sourceColumnName} when selecting from ${sourceTableName}; if specific fields are requested, select only those; otherwise, include all fields from both tables`;
            }
        } else {
            if (relationType === RelationType.ManyToMany && junctionTableName) {
                ruleText = `Only trigger an automatic ${joinType} JOIN between ${sourceTableName} and ${targetTableName} through ${junctionTableName} on ${sourceTableName}.${sourceColumnName} = ${junctionTableName}.${sourceColumnName} and ${junctionTableName}.${targetColumnName} = ${targetTableName}.${targetColumnName} if the user's query explicitly requests to join, combine, or compare these two specific tables (or their obvious synonyms); if the user's SELECT statement specifies particular fields, use only those in the result set, but if no specific fields are requested (e.g., a SELECT * query), then include all columns from both tables in the output`;
            } else if (joinType === JoinType.CROSS) {
                ruleText = `Only trigger an automatic CROSS JOIN between ${sourceTableName} and ${targetTableName} if the user's query explicitly requests to join, combine, or compare these two specific tables (or their obvious synonyms); if the user's SELECT statement specifies particular fields, use only those in the result set, but if no specific fields are requested (e.g., a SELECT * query), then include all columns from both tables in the output`;
            } else {
                ruleText = `Only trigger an automatic ${joinType} JOIN between ${sourceTableName} and ${targetTableName} on ${sourceTableName}.${sourceColumnName} = ${targetTableName}.${targetColumnName} if the user's query explicitly requests to join, combine, or compare these two specific tables (or their obvious synonyms); if the user's SELECT statement specifies particular fields, use only those in the result set, but if no specific fields are requested (e.g., a SELECT * query), then include all columns from both tables in the output`;
            }
        }

        return {
            id: 0,
            text: ruleText,
            isActive: true,
            serviceTableId: serviceTableId,
            updatedAt: new Date()
        };
    }
}
