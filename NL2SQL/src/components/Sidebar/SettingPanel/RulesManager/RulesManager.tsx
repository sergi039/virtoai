import {
  PrimaryButton,
  IconButton,
  Toggle,
  TextField,
  MessageBar,
  MessageBarType,
  Text,
  DefaultButton
} from '@fluentui/react';
import { useState, useEffect } from 'react';
import strings from '../../../../Ioc/en-us';
import { IRulesManagerProps } from './RulesManager.types';
import { getClassNames, getStyles } from './RulesManager.styles';
import { useNL2SQLStore } from '../../../../stores/useNL2SQLStore';
import { ISqlGenerationRule } from '../../../../api/model/ISqlGenerationRule';

const ITEMS_PER_PAGE = 10;

export const RulesManager: React.FunctionComponent<IRulesManagerProps> = ({theme: customTheme}) => {
  const { getAllRules, addRule, editRule, deleteRule, currentTheme } = useNL2SQLStore();
  const [rules, setRules] = useState<ISqlGenerationRule[]>([]);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newRule, setNewRule] = useState<Omit<ISqlGenerationRule, 'id'>>({ 
    text: '', 
    isActive: true, 
    serviceTableId: null,
    updatedAt: new Date() 
  });
  const [message, setMessage] = useState<{ text: string; type: MessageBarType } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const theme = customTheme || currentTheme;

  useEffect(() => {
    loadRules();
  }, []);

  const classNames = getClassNames(getStyles, { theme });

  const calculateRows = (text: string): number => {
    if (!text) return 2; 
    const lines = text.split('\n').length;
    const wrappedLines = Math.ceil(text.length / 80); 
    const totalLines = Math.max(lines, wrappedLines);
    return Math.max(3, Math.min(totalLines, 8)); 
  };

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const backendRules = await getAllRules();
      const sortedRules = backendRules.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setRules(sortedRules);
    } catch (error) {
      setMessage({ 
        text: strings.SettingsPanel.rules.failedToLoadRules, 
        type: MessageBarType.error 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(rules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRules = rules.slice(startIndex, endIndex);

  const handleStartEdit = (ruleId: number) => {
    setEditingRuleId(ruleId);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingRuleId(null);
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setNewRule({ text: '', isActive: true, serviceTableId: null, updatedAt: new Date() });
    setEditingRuleId(null);
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewRule({ text: '', isActive: true, serviceTableId: null, updatedAt: new Date() });
  };

  const handleSaveNew = async () => {
    if (newRule.text.trim()) {
      try {
        const ruleToSave: Omit<ISqlGenerationRule, 'id'> = {
          text: newRule.text.trim(),
          serviceTableId: newRule.serviceTableId || null,
          isActive: newRule.isActive,
          updatedAt: new Date()
        };
        
        const savedRule = await addRule(ruleToSave as ISqlGenerationRule);
        
        setRules(prevRules => {
          const updatedRules = [...prevRules, savedRule];
          return updatedRules.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
        
        setIsAddingNew(false);
        setNewRule({ text: '', isActive: true, serviceTableId: null, updatedAt: new Date() });
        setMessage({ text: strings.SettingsPanel.rules.ruleAdded, type: MessageBarType.success });
      } catch (error) {
        setMessage({ 
          text: strings.SettingsPanel.rules.failedToSaveRule, 
          type: MessageBarType.error 
        });
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRuleId) return;
    
    try {
      const ruleToUpdate = rules.find(r => r.id === editingRuleId);
      if (ruleToUpdate) {
        const updatedRuleData: ISqlGenerationRule = {
          ...ruleToUpdate,
          updatedAt: new Date()
        };
        
        const updatedRule = await editRule(editingRuleId, updatedRuleData);
        
        setRules(prevRules => {
          const updatedRules = prevRules.map(rule =>
            rule.id === editingRuleId ? updatedRule : rule
          );
          return updatedRules.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      }
      
      setEditingRuleId(null);
      setMessage({ text: strings.SettingsPanel.rules.ruleUpdated, type: MessageBarType.success });
    } catch (error) {
      setMessage({ 
        text: strings.SettingsPanel.rules.failedToUpdateRule, 
        type: MessageBarType.error 
      });
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    try {
      await deleteRule(ruleId);
      
      setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
      setMessage({ text: strings.SettingsPanel.rules.ruleDeleted, type: MessageBarType.success });
    } catch (error) {
      setMessage({ 
        text: strings.SettingsPanel.rules.failedToDeleteRule, 
        type: MessageBarType.error 
      });
    }
  };

  const handleUpdateRule = async (ruleId: number, field: keyof ISqlGenerationRule, value: any) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, [field]: value, updatedAt: new Date() } : rule
      )
    );
    if (field === 'isActive') {
      try {
        const ruleToUpdate = rules.find(r => r.id === ruleId);
        if (ruleToUpdate) {
          const updatedRuleData: ISqlGenerationRule = {
            ...ruleToUpdate,
            [field]: value,
            updatedAt: new Date()
          };
          
          await editRule(ruleId, updatedRuleData);
          
          setRules(prevRules => 
            prevRules.sort((a, b) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
          );
        }
      } catch (error) {
        setRules(prevRules =>
          prevRules.map(rule =>
            rule.id === ruleId ? { ...rule, [field]: !value } : rule
          )
        );
        setMessage({ 
          text: strings.SettingsPanel.rules.failedToUpdateRule, 
          type: MessageBarType.error 
        });
      }
    }
  };

  const handleUpdateNewRule = (field: keyof Omit<ISqlGenerationRule, 'id'>, value: any) => {
    setNewRule(prev => ({ ...prev, [field]: value }));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const formatPageInfo = (pageInfo: string, currentPage: number, totalPages: number, totalRules: number) => {
    return pageInfo.replace('{0}', currentPage.toString())
                   .replace('{1}', totalPages.toString())
                   .replace('{2}', totalRules.toString());
  };

  return (
    <div className={classNames.container}>
      {message && (
        <MessageBar
          messageBarType={message.type}
          isMultiline={false}
          onDismiss={() => setMessage(null)}
          dismissButtonAriaLabel="Close"
          className={classNames.messageBar}
        >
          {message.text}
        </MessageBar>
      )}

      <div className={classNames.header}>
        <PrimaryButton 
          text={strings.SettingsPanel.rules.addRule} 
          onClick={handleStartAdd}
          disabled={isAddingNew}
        />
      </div>

      {rules.length === 0 && !isAddingNew ? (
        isLoading ? (
          <Text className={classNames.noRules}>
            {strings.SettingsPanel.rules.loadingRules}
          </Text>
        ) : (
          <Text className={classNames.noRules}>
            {strings.SettingsPanel.rules.noRules}
          </Text>
        )
      ) : (
        <>
          <div className={classNames.rulesList}>
            {isAddingNew && (
              <div className={`${classNames.ruleItem} ${classNames.ruleItemAdding}`}>
                <div className={classNames.ruleContent}>
                  <div className={classNames.ruleLeftSection}>
                    <TextField
                      placeholder={strings.SettingsPanel.rules.enterRuleText}
                      value={newRule.text}
                      onChange={(_, value) => handleUpdateNewRule('text', value || '')}
                      className={classNames.ruleNameField}
                      multiline
                      rows={calculateRows(newRule.text)}
                    />
                    <div className={classNames.toggleContainer}>
                      <Toggle
                        checked={newRule.isActive}
                        onChange={(_, checked) => handleUpdateNewRule('isActive', !!checked)}
                        onText=""
                        offText=""
                      />
                    </div>
                  </div>
                  <div className={classNames.actionButtons}>
                    <IconButton
                      iconProps={{ iconName: 'Save' }}
                      title={strings.SettingsPanel.rules.save}
                      ariaLabel={strings.SettingsPanel.rules.save}
                      onClick={handleSaveNew}
                      disabled={!newRule.text.trim()}
                    />
                    <IconButton
                      iconProps={{ iconName: 'Cancel' }}
                      title={strings.SettingsPanel.rules.cancel}
                      ariaLabel={strings.SettingsPanel.rules.cancel}
                      onClick={handleCancelAdd}
                    />
                  </div>
                </div>
              </div>
            )}

            {paginatedRules.map((rule) => (
              <div
                key={rule.id}
                className={`${classNames.ruleItem} ${editingRuleId === rule.id ? classNames.ruleItemEditing : ''}`}
              >
                <div className={classNames.ruleContent}>
                  <div className={classNames.ruleLeftSection}>
                    {editingRuleId === rule.id ? (
                      <TextField
                        value={rule.text}
                        onChange={(_, value) => handleUpdateRule(rule.id, 'text', value || '')}
                        className={classNames.ruleNameField}
                        multiline
                        rows={calculateRows(rule.text)}
                      />
                    ) : (
                      <Text className={classNames.ruleName}>
                        {rule.text}
                      </Text>
                    )}
                    <div className={classNames.toggleContainer}>
                      <Toggle
                        checked={rule.isActive}
                        onChange={(_, checked) => handleUpdateRule(rule.id, 'isActive', !!checked)}
                        disabled={editingRuleId === rule.id}
                        onText=""
                        offText=""
                      />
                    </div>
                  </div>
                  <div className={classNames.actionButtons}>
                    {editingRuleId === rule.id ? (
                      <>
                        <IconButton
                          iconProps={{ iconName: 'Save' }}
                          title={strings.SettingsPanel.rules.save}
                          ariaLabel={strings.SettingsPanel.rules.save}
                          onClick={handleSaveEdit}
                        />
                        <IconButton
                          iconProps={{ iconName: 'Cancel' }}
                          title={strings.SettingsPanel.rules.cancel}
                          ariaLabel={strings.SettingsPanel.rules.cancel}
                          onClick={handleCancelEdit}
                        />
                      </>
                    ) : (
                      <>
                        {rule.serviceTableId === null && (
                          <>
                            <IconButton
                              iconProps={{ iconName: 'Edit' }}
                              title={strings.SettingsPanel.rules.editRule}
                              ariaLabel={strings.SettingsPanel.rules.editRule}
                              onClick={() => handleStartEdit(rule.id)}
                            />
                            <IconButton
                              iconProps={{ iconName: 'Delete' }}
                              title={strings.SettingsPanel.rules.deleteRule}
                              ariaLabel={strings.SettingsPanel.rules.deleteRule}
                              onClick={() => handleDeleteRule(rule.id)}
                            />
                          </>
                        )}
                        {rule.serviceTableId !== null && (
                          <Text variant="small" className={classNames.autoGeneratedLabel}>
                            {strings.SettingsPanel.rules.autoGenerated}
                          </Text>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={classNames.pagination}>
              <DefaultButton
                text={strings.SettingsPanel.rules.previousPage}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
              <Text className={classNames.paginationInfo}>
                {formatPageInfo(strings.SettingsPanel.rules.pageInfo, currentPage, totalPages, rules.length)}
              </Text>
              <DefaultButton
                text={strings.SettingsPanel.rules.nextPage}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
