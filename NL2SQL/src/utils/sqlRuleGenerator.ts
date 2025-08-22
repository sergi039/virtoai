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
            junctionTableName
        } = params;

        let ruleText: string;

        if (relationType === RelationType.ManyToMany && junctionTableName) {
            ruleText = `Always ${joinType} JOIN ${junctionTableName} ON ${sourceTableName}.${sourceColumnName} = ${junctionTableName}.${sourceColumnName} then ${joinType} JOIN ${targetTableName} ON ${junctionTableName}.${targetColumnName} = ${targetTableName}.${targetColumnName} when selecting from ${sourceTableName}; if specific fields are requested, select only those; otherwise, include all fields from ${sourceTableName} and ${targetTableName}`;
        } else if (joinType === JoinType.CROSS) {
            ruleText = `Always CROSS JOIN ${targetTableName} with ${sourceTableName} when selecting from ${sourceTableName}; if specific fields are requested, select only those; otherwise, include all fields from both tables`;
        } else {
            ruleText = `Always ${joinType} JOIN ${targetTableName} with ${sourceTableName} their link ${targetTableName}.${targetColumnName} = ${sourceTableName}.${sourceColumnName} when selecting from ${sourceTableName}; if specific fields are requested, select only those; otherwise, include all fields from both tables`;
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
