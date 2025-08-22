import React, { useState } from 'react';
import {
    Stack,
    Text,
    MessageBar,
    MessageBarType,
    Dropdown,
    IDropdownOption,
    PrimaryButton,
    DefaultButton,
    Spinner,
    SpinnerSize,
    Toggle,
} from '@fluentui/react';
import strings from '../../../../../../Ioc/en-us';
import { RelationType } from '../../../../../../api/constants/relationType';
import { JoinType } from '../../../../../../api/constants/joinType';
import { CascadeType } from '../../../../../../api/constants/cascadeType';
import { ICreateRelationTabProps, ICreateRelationTabStyleProps } from './CreateRelationTab.types';
import { getClassNames, getStyles } from './CreateRelationTab.styles';

export const CreateRelationTab: React.FC<ICreateRelationTabProps> = ({
    theme,
    isLoading,
    relationAlreadyExists,
    serviceOptions,
    sourceServiceId,
    sourceTableOptions,
    sourceTableName,
    sourceColumnOptions,
    sourceColumnName,
    targetServiceId,
    targetTableOptions,
    targetTableName,
    targetColumnOptions,
    targetColumnName,
    relationTypeOptions,
    relationType,
    joinTypeOptions,
    joinType,
    cascadeOptions,
    onUpdateAction,
    onDeleteAction,
    isFormValid,
    onSourceServiceChange,
    onSourceTableChange,
    onSourceColumnChange,
    onTargetServiceChange,
    onTargetTableChange,
    onTargetColumnChange,
    onRelationTypeChange,
    onJoinTypeChange,
    onUpdateActionChange,
    onDeleteActionChange,
    onCreateExplicitRelation,
    onCreateImplicitRelation,
    onCancel,
}) => {
    const styleProps: ICreateRelationTabStyleProps = { theme };
    const classNames = getClassNames(getStyles, styleProps);
    const [isImplicitRelation, setIsImplicitRelation] = useState<boolean>(false);

    const handleServiceChange = (
        option: IDropdownOption | undefined,
        isSource: boolean
    ) => {
        if (!option || option.key === undefined) return;
        const serviceId = option.key === 'null' ? null : Number(option.key);

        if (isSource) {
            onSourceServiceChange(serviceId);
        } else {
            onTargetServiceChange(serviceId);
        }
    };

    const handleTableChange = (
        option: IDropdownOption | undefined,
        isSource: boolean
    ) => {
        if (!option || option.key === undefined) return;
        const tableName = option.key as string;

        if (isSource) {
            onSourceTableChange(tableName);
        } else {
            onTargetTableChange(tableName);
        }
    };

    const handleCreateRelation = () => {
        if(isImplicitRelation){
            onCreateImplicitRelation();
        }
        else{
            onCreateExplicitRelation();
        }
    }

    const handleColumnChange = (
        option: IDropdownOption | undefined,
        isSource: boolean
    ) => {
        if (!option || option.key === undefined) return;
        const columnName = option.key as string;

        if (isSource) {
            onSourceColumnChange(columnName);
        } else {
            onTargetColumnChange(columnName);
        }
    };

    const handleRelationTypeChange = (option: IDropdownOption | undefined) => {
        if (!option || option.key === undefined) return;
        onRelationTypeChange(option.key as RelationType);
    };

    const handleJoinTypeChange = (option: IDropdownOption | undefined) => {
        if (!option || option.key === undefined) return;
        onJoinTypeChange(option.key as JoinType);
    };

    const handleUpdateActionChange = (option: IDropdownOption | undefined) => {
        if (!option || option.key === undefined) return;
        onUpdateActionChange(option.key as CascadeType);
    };

    const handleDeleteActionChange = (option: IDropdownOption | undefined) => {
        if (!option || option.key === undefined) return;
        onDeleteActionChange(option.key as CascadeType);
    };

    if (isLoading) {
        return (
            <Stack className={classNames.container}>
                <Stack className={classNames.content}>
                    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 20 }}>
                        <Spinner size={SpinnerSize.large} />
                        <Text>{strings.SettingsPanel.loading}</Text>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack className={classNames.container}>
            <Stack className={classNames.content}>
                {relationAlreadyExists && (
                    <MessageBar
                        messageBarType={MessageBarType.warning}
                        className={classNames.warningMessage}
                    >
                        {strings.SettingsPanel.relations.relationAlreadyExists}
                    </MessageBar>
                )}

                <Toggle
                    label={strings.SettingsPanel.relations.relationTypeToggle}
                    inlineLabel
                    checked={isImplicitRelation}
                    onText={strings.SettingsPanel.relations.implicitRelation}
                    offText={strings.SettingsPanel.relations.explicitRelation}
                    onChange={(_, checked) => setIsImplicitRelation(!!checked)}
                />

                <Stack className={classNames.formGrid}>
                    <Stack tokens={{ childrenGap: 16 }}>
                        <Text variant="mediumPlus">{strings.SettingsPanel.relations.sourceTable}</Text>

                        <Dropdown
                            label={strings.SettingsPanel.relations.sourceService}
                            options={serviceOptions}
                            selectedKey={sourceServiceId}
                            onChange={(_, option) => handleServiceChange(option, true)}
                            placeholder={strings.SettingsPanel.relations.selectService}
                            disabled={true}
                        />

                        <Dropdown
                            label={strings.SettingsPanel.relations.sourceTableLabel}
                            options={sourceTableOptions}
                            selectedKey={sourceTableName}
                            onChange={(_, option) => handleTableChange(option, true)}
                            placeholder={strings.SettingsPanel.relations.selectTable}
                            disabled={true}
                        />

                        <Dropdown
                            label={strings.SettingsPanel.relations.sourceColumn}
                            options={sourceColumnOptions}
                            selectedKey={sourceColumnName}
                            onChange={(_, option) => handleColumnChange(option, true)}
                            placeholder={strings.SettingsPanel.relations.selectColumn}
                            disabled={!sourceTableName}
                        />

                        <Dropdown
                            label={strings.SettingsPanel.relations.relationType}
                            options={relationTypeOptions}
                            selectedKey={relationType}
                            onChange={(_, option) => handleRelationTypeChange(option)}
                        />

                        {!isImplicitRelation && (
                            <Dropdown
                                label={strings.SettingsPanel.relations.onUpdateAction}
                                options={cascadeOptions}
                                selectedKey={onUpdateAction}
                                onChange={(_, option) => handleUpdateActionChange(option)}
                            />
                        )}
                    </Stack>

                    <Stack tokens={{ childrenGap: 16 }}>
                        <Text variant="mediumPlus">{strings.SettingsPanel.relations.targetTable}</Text>

                        <Dropdown
                            label={strings.SettingsPanel.relations.targetService}
                            options={serviceOptions}
                            selectedKey={targetServiceId}
                            onChange={(_, option) => handleServiceChange(option, false)}
                            placeholder={strings.SettingsPanel.relations.selectService}
                        />

                        <Dropdown
                            label={strings.SettingsPanel.relations.targetTableLabel}
                            options={targetTableOptions}
                            selectedKey={targetTableName}
                            onChange={(_, option) => handleTableChange(option, false)}
                            placeholder={strings.SettingsPanel.relations.selectTable}
                            disabled={!targetServiceId}
                        />

                        <Dropdown
                            label={strings.SettingsPanel.relations.targetColumn}
                            options={targetColumnOptions}
                            selectedKey={targetColumnName}
                            onChange={(_, option) => handleColumnChange(option, false)}
                            placeholder={strings.SettingsPanel.relations.selectColumn}
                            disabled={!targetTableName}
                        />

                        <Dropdown
                            label={strings.SettingsPanel.relations.jointionTable}
                            options={joinTypeOptions}
                            selectedKey={joinType}
                            onChange={(_, option) => handleJoinTypeChange(option)}
                        />

                        {!isImplicitRelation && (
                            <Dropdown
                                label={strings.SettingsPanel.relations.onDeleteAction}
                                options={cascadeOptions}
                                selectedKey={onDeleteAction}
                                onChange={(_, option) => handleDeleteActionChange(option)}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>

            <Stack className={classNames.footer} horizontal horizontalAlign="space-between">
                <PrimaryButton
                    text={strings.SettingsPanel.relations.createRelation}
                    onClick={handleCreateRelation}
                    disabled={!isFormValid}
                />
                <DefaultButton
                    text={strings.SettingsPanel.relations.cancel}
                    onClick={onCancel}
                />
            </Stack>
        </Stack>
    );
};
