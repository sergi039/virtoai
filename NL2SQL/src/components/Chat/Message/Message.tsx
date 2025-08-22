import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  styled,
  Icon,
  MessageBar,
  MessageBarType,
  mergeStyles,
  TextField,
  Pivot,
  PivotItem
} from '@fluentui/react';
import type { IMessageProps, IMessageStyleProps, IMessageStyles } from './Message.types';
import { getStyles, getClassNames } from './Message.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';
import { ITrainingAiData } from '../../../api/model/ITrainingAiData';
import toast from 'react-hot-toast';
import { UrlTemplateUtils } from '../../../utils/urlTemplateUtils';
import { ReactionType, ISqlMessage, IMessage } from '../../../api/model';
import { ExpandedTableView } from './ExpandedTableView';
import { ContextMenu } from './ContextMenu';
import { SingleRecordView } from './SingleRecordView';
import { DataTable } from './DataTable';

const MessageBase: React.FunctionComponent<IMessageProps> = ({ message, theme: customTheme }) => {
  const {
    currentTheme,
    saveTrainingData,
    editSqlMessage,
    getServiceTableFieldByTableAndFieldName,
    isInitializeStore,
    insertTextToInput,
    currentMessages
  } = useNL2SQLStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSqlEditor, setShowSqlEditor] = useState<boolean>(false);
  const [showCombinedQuery, setShowCombinedQuery] = useState<boolean>(false);
  const [currentSqlMessage, setCurrentSqlMessage] = useState<ISqlMessage | null>(
    message.sqlMessages && message.sqlMessages.length > 0 ? message.sqlMessages[0] : null
  );
  const [editedSqlQuery, setEditedSqlQuery] = useState<string>(currentSqlMessage?.sql || '');
  const [isEditingSql, setIsEditingSql] = useState<boolean>(false);
  const [isHoveredUserMessage, setIsHoveredUserMessage] = useState<boolean>(false);
  const [selectedTabKey, setSelectedTabKey] = useState<string>(
    message.sqlMessages && message.sqlMessages.length > 0 ? message.sqlMessages[0].id.toString() : ''
  );
  const [showExpandedTable, setShowExpandedTable] = useState<boolean>(false);
  const [expandedTableData, setExpandedTableData] = useState<Array<Record<string, any>>>([]);

  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    target: MouseEvent | null;
    cellValue: any;
    fieldName: string;
    tableName?: string;
    columnName?: string;
    rowData?: Record<string, any>;
  }>({
    isVisible: false,
    target: null,
    cellValue: null,
    fieldName: '',
    tableName: '',
    columnName: '',
    rowData: undefined,
  });

  const itemsPerPage = 20;

  const handleCellClick = (_value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => {
    if (tableName && columnName && rowData) {
      const serviceTableField = getServiceTableFieldByTableAndFieldName(tableName, columnName);

      if (serviceTableField && serviceTableField.urlTemplate) {
        const processedUrl = UrlTemplateUtils.getProcessedUrl(serviceTableField, rowData, fieldName);

        if (processedUrl) {
          window.open(processedUrl, '_blank');
        }
      }
    }
  };

  const handleCellRightClick = (event: React.MouseEvent, value: any, fieldName: string, tableName?: string, columnName?: string, rowData?: Record<string, any>) => {
    event.preventDefault();

    if (value === null || value === undefined || (typeof value === 'string' && value.toLowerCase().includes('value is null'))) {
      toast.error(strings.Chat.ContextMenu.emptyFieldError);
      return;
    }

    setContextMenu({
      isVisible: true,
      target: event.nativeEvent,
      cellValue: value,
      fieldName,
      tableName,
      columnName,
      rowData,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false, target: null }));
  };

  const parseClarificationData = (message: IMessage): { questions: string[], suggests: string[], isUnclearRequest: boolean } | null => {
    try {
      let questions: string[] = [];
      let suggests: string[] = [];

      if (message.followUpQuestions) {
        const parsedQuestions = JSON.parse(message.followUpQuestions);
        if (Array.isArray(parsedQuestions)) {
          questions = parsedQuestions;
        }
      }

      if (message.suggestions) {
        const parsedSuggests = JSON.parse(message.suggestions);
        if (Array.isArray(parsedSuggests)) {
          suggests = parsedSuggests;
        }
      }

      const isUnclearRequest = questions.length === 1 && questions[0] === strings.Chat.unclearRequest;

      if (questions.length > 0 || suggests.length > 0) {
        return { questions, suggests, isUnclearRequest };
      }
    } catch (error) {
      console.error('Error parsing clarification data:', error);
    }

    return null;
  };

  const handleSuggestionClick = (suggestion: string) => {
    insertTextToInput(suggestion);
  };

  const isLastMessage = () => {
    if (!currentMessages || currentMessages.length === 0) return true;

    const lastMessage = currentMessages[currentMessages.length - 1];
    return lastMessage.id === message.id;
  };

  const isCellClickable = (tableName: string, columnName: string, rowData?: Record<string, any>): boolean => {
    if (!isInitializeStore || !rowData) {
      return false;
    }

    const serviceTableField = getServiceTableFieldByTableAndFieldName(tableName, columnName);
    if (!serviceTableField?.urlTemplate) {
      return false;
    }

    const fieldKey = Object.keys(rowData).find(key => key.endsWith(`:${tableName}.${columnName}`)) || '';
    const result = UrlTemplateUtils.checkUrlAvailability(serviceTableField, rowData, fieldKey);

    return result.isUrlAvailable;
  };

  useEffect(() => {
    if (message.sqlMessages && message.sqlMessages.length > 0) {
      if (selectedTabKey) {
        const selectedSqlMessage = message.sqlMessages.find(sql => sql.id.toString() === selectedTabKey);
        if (selectedSqlMessage) {
          setCurrentSqlMessage(selectedSqlMessage);
          setEditedSqlQuery(selectedSqlMessage.sql || '');
          return;
        }
      }

      const firstSqlMessage = message.sqlMessages[0];
      setCurrentSqlMessage(firstSqlMessage);
      setEditedSqlQuery(firstSqlMessage.sql || '');
      setSelectedTabKey(firstSqlMessage.id.toString());
    }
    setShowSqlEditor(false);
    setShowCombinedQuery(false);
    setIsEditingSql(false);
  }, [message.sqlMessages, selectedTabKey]);

  const styleProps: IMessageStyleProps = { theme: customTheme || currentTheme, isUser: message.isUser };
  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);

  const handleCopy = () => {
    if (message.isUser) {
      navigator.clipboard.writeText(message.text || '');
      toast.success(strings.Chat.textCopied);
      return;
    }

    if (currentSqlMessage?.sql) {
      navigator.clipboard.writeText(currentSqlMessage.sql);
      toast.success('SQL copied to clipboard');
    } else {
      navigator.clipboard.writeText(message.text || '');
      toast.success(strings.Chat.textCopied);
    }
  };

  const handleShowSql = () => {
    if (currentSqlMessage) {
      setEditedSqlQuery(currentSqlMessage.sql || '');
    }
    setShowSqlEditor(!showSqlEditor);
    setShowCombinedQuery(false); 
    setIsEditingSql(false);
  };

  const handleShowCombinedQuery = () => {
    setShowCombinedQuery(!showCombinedQuery);
    setShowSqlEditor(false); 
    setIsEditingSql(false);
  };

  const handleEditSql = () => {
    setIsEditingSql(true);
  };

  const handleCancelEdit = () => {
    setEditedSqlQuery(currentSqlMessage?.sql || '');
    setIsEditingSql(false);
  };

  const handleSaveSql = async () => {
    if (editedSqlQuery.trim() === '' || !currentSqlMessage) {
      return;
    }

    const addData: ITrainingAiData = {
      generatedSql: editedSqlQuery,
      naturalLanguageQuery: message.text || '',
    }

    try {
      const result = await saveTrainingData(addData);
      if (result) {
        const updatedSqlMessage = { ...currentSqlMessage, sql: editedSqlQuery };

        await editSqlMessage(currentSqlMessage.id, updatedSqlMessage);

        setCurrentSqlMessage(updatedSqlMessage);
        toast.success(strings.Chat.sqlSavedSuccess);
      } else {
        toast.error(strings.Chat.sqlSavedFailed);
      }
      setIsEditingSql(false);
    } catch (error) {
      toast.error(strings.Chat.sqlSavedFailed);
    }
  };

  const handleLike = async () => {
    if (!currentSqlMessage) return;

    const newReaction = currentSqlMessage.reaction === ReactionType.Like ? ReactionType.None : ReactionType.Like;
    const addData: ITrainingAiData = {
      generatedSql: currentSqlMessage.sql || '',
      naturalLanguageQuery: message.text || '',
    };

    try {
      const result = await saveTrainingData(addData);
      if (result) {
        const updatedSqlMessage = { ...currentSqlMessage, reaction: newReaction };

        await editSqlMessage(currentSqlMessage.id, updatedSqlMessage);

        setCurrentSqlMessage(updatedSqlMessage);
        toast.success(strings.Chat.feedbackSaveSuccess);
      } else {
        toast.error(strings.Chat.feedbackSaveFailed);
      }
    } catch (error) {
      toast.error(strings.Chat.feedbackSaveFailed);
    }
  };

  const handleDislike = async () => {
    if (!currentSqlMessage) return;

    const newReaction = currentSqlMessage.reaction === ReactionType.Dislike ? ReactionType.None : ReactionType.Dislike;

    try {
      const updatedSqlMessage = { ...currentSqlMessage, reaction: newReaction };

      await editSqlMessage(currentSqlMessage.id, updatedSqlMessage);

      setCurrentSqlMessage(updatedSqlMessage);
      toast.success(strings.Chat.feedbackSaveSuccess);
    } catch (error) {
      toast.error(strings.Chat.feedbackSaveFailed);
    }
  };

  const handleTabChange = (item?: PivotItem) => {
    if (item && item.props.itemKey) {
      const sqlMessage = message.sqlMessages.find(sql => sql.id.toString() === item.props.itemKey);
      if (sqlMessage) {
        setCurrentSqlMessage(sqlMessage);
        setEditedSqlQuery(sqlMessage.sql || '');
        setSelectedTabKey(item.props.itemKey);
        setCurrentPage(1);
      }
    }
  };

  const handleExpandTable = () => {
    if (!currentSqlMessage?.text) return;

    try {
      const results = JSON.parse(currentSqlMessage.text) as Array<Record<string, any>>;
      if (results.length > 0) {
        setExpandedTableData(results);
        setShowExpandedTable(true);
      }
    } catch (error) {
      console.error('Failed to parse SQL message text for expanded view:', error);
    }
  };

  const handleCloseExpandedTable = () => {
    setShowExpandedTable(false);
    setExpandedTableData([]);
  };

  const renderMessage = () => {
    if (message.isUser) {
      return (
        <div
          className={classNames.userMessageContainer}
          onMouseEnter={() => setIsHoveredUserMessage(true)}
          onMouseLeave={() => setIsHoveredUserMessage(false)}
        >
          <Text className={classNames.contentUser}>{message.text}</Text>
          <div className={`${classNames.userMessageCopyButton} ${isHoveredUserMessage ? classNames.userMessageCopyButtonVisible : ''}`}>
            <Icon
              iconName="Copy"
              className={classNames.userMessageCopyIcon}
              onClick={handleCopy}
            />
          </div>
        </div>
      );
    }

    if (message.isLoading != undefined && message.isLoading) {
      return (
        <div className={classNames.contentAI}>
          <div className={classNames.loadingDots}>
            <span className={classNames.loadingDot}>.</span>
            <span className={classNames.loadingDot}>.</span>
            <span className={classNames.loadingDot}>.</span>
          </div>
        </div>
      );
    }

    if (!message.isUser && (message.followUpQuestions || message.suggestions)) {
      const clarificationData = parseClarificationData(message);

      if (clarificationData) {
        return (
          <div className={classNames.contentAI}>
            {clarificationData.questions.length > 0 && (
              <div className={classNames.questionsContainer}>
                <Text className={classNames.questionsTitle}>
                  {strings.Chat.clarificationQuestions}
                </Text>
                <div className={classNames.aiQuestionContent}>
                  <Text className={classNames.aiQuestionText}>
                    {clarificationData.questions.join('\n')}
                  </Text>
                </div>
              </div>
            )}

            {!clarificationData.isUnclearRequest && message.sqlMessages && message.sqlMessages.length > 0 && (
              <div>
                {message.sqlMessages.length === 1 ? (
                  <>
                    {renderSqlMessageContent(message.sqlMessages[0])}
                  </>
                ) : (
                  <Pivot
                    selectedKey={selectedTabKey}
                    onLinkClick={handleTabChange}
                    styles={styleNames.pivotStyles}
                  >
                    {message.sqlMessages.map((sqlMessage) => (
                      <PivotItem
                        key={sqlMessage.id.toString()}
                        itemKey={sqlMessage.id.toString()}
                        headerText={sqlMessage.model}
                        className={classNames.pivotItemStyles}
                      >
                        {renderSqlMessageContent(sqlMessage)}
                      </PivotItem>
                    ))}
                  </Pivot>
                )}
              </div>
            )}

            {clarificationData.suggests && clarificationData.suggests.length > 0 && (
              <div className={classNames.suggestionsTextContainer}>
                <Text className={classNames.suggestionsTextTitle}>
                  {strings.Chat.suggestedOptions}
                </Text>
                <div className={classNames.suggestionsTextList}>
                  {clarificationData.suggests.map((suggestion, index) => {
                    const isDisabled = !isLastMessage();
                    return (
                      <div
                        key={index}
                        className={isDisabled ? classNames.suggestionTextItem : classNames.suggestionTextItemClickable}
                        onClick={() => !isDisabled && handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className={classNames.contentAI}>
            <div className={classNames.aiQuestionContainer}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Icon
                  iconName="MessageFill"
                  className={classNames.aiQuestionIcon}
                />
                <div className={classNames.aiQuestionContent}>
                  <Text className={classNames.aiQuestionText}>
                    {message.text}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }


    if (!message.sqlMessages || message.sqlMessages.length === 0) {
      if (message.text === strings.Chat.unclearRequest || 
          (message.followUpQuestions && message.followUpQuestions.includes(strings.Chat.unclearRequest))) {
        return (
          <div className={classNames.contentAI}>
            <div className={classNames.questionsContainer}>
              <Text className={classNames.questionsTitle}>
                {strings.Chat.clarificationQuestions}
              </Text>
              <div className={classNames.aiQuestionContent}>
                <Text className={classNames.aiQuestionText}>
                  {message.text}
                </Text>
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div className={classNames.contentAI}>
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            styles={styleNames.messageEmptyData}
          >
            {message.text || strings.Chat.invalidResponse}
          </MessageBar>
        </div>
      );
    }

    if (message.sqlMessages.length === 1) {
      return (
        <div className={classNames.contentAI}>
          {renderSqlMessageContent(message.sqlMessages[0])}
        </div>
      );
    }

    return (
      <div className={classNames.contentAI}>
        <Pivot
          selectedKey={selectedTabKey}
          onLinkClick={handleTabChange}
          styles={styleNames.pivotStyles}
        >
          {message.sqlMessages.map((sqlMessage) => (
            <PivotItem
              key={sqlMessage.id}
              itemKey={sqlMessage.id.toString()}
              headerText={sqlMessage.model}
              className={classNames.pivotItemStyles}
            >
              {renderSqlMessageContent(sqlMessage)}
            </PivotItem>
          ))}
        </Pivot>
      </div>
    );
  };

  const renderSqlMessageContent = (sqlMessage: ISqlMessage) => {
    if (sqlMessage.isLoading || sqlMessage.text === strings.Chat.loading) {
      return (
        <div className={classNames.loadingTabContent}>
          <div className={classNames.loadingDots}>
            <span className={classNames.loadingDot}>.</span>
            <span className={classNames.loadingDot}>.</span>
            <span className={classNames.loadingDot}>.</span>
          </div>
        </div>
      );
    }

    if (sqlMessage.isSyntaxError) {
      return (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          styles={styleNames.messageEmptyData}
        >
          {strings.Chat.syntaxError}
        </MessageBar>
      );
    }

    if (sqlMessage.errorMessage && !sqlMessage.isSyntaxError) {
      return (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          styles={styleNames.messageEmptyData}
        >
          {strings.Chat.generationError}
        </MessageBar>
      );
    }

    if (!sqlMessage.text || sqlMessage.text.trim() === '') {
      return (
        <MessageBar
          messageBarType={MessageBarType.info}
          isMultiline={false}
          styles={styleNames.messageEmptyData}
        >
          {strings.Chat.noResultsFound}
        </MessageBar>
      );
    }

    try {
      const results = JSON.parse(sqlMessage.text) as Array<Record<string, any>>;

      if (results.length === 0) {
        return (
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={false}
            styles={styleNames.messageEmptyData}
          >
            {strings.Chat.noResultsFound}
          </MessageBar>
        );
      }

      if (results.length === 1) {
        return (
          <div>
            <SingleRecordView
              record={results[0]}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              isCellClickable={isCellClickable}
              theme={customTheme || currentTheme}
              strings={strings}
            />
            {renderTableActionButtons()}
          </div>
        );
      }

      return (
        <div>
          <DataTable
            data={results}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
            isCellClickable={isCellClickable}
            theme={customTheme || currentTheme}
            strings={strings}
          />
          {renderTableActionButtons()}
        </div>
      );
    } catch (error) {
      return (
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={true}
          styles={styleNames.messageEmptyData}
        >
          {sqlMessage.text}
        </MessageBar>
      );
    }
  };

  const renderSqlEditor = () => {
    if (!currentSqlMessage?.sql) return null;

    const containerClassName = showSqlEditor
      ? classNames.sqlEditorContainer
      : mergeStyles(classNames.sqlEditorContainer, classNames.sqlEditorContainerHidden);

    return (
      <div className={containerClassName}>
        {isEditingSql ? (
          <TextField
            multiline
            autoAdjustHeight
            value={editedSqlQuery}
            onChange={(_, newValue) => setEditedSqlQuery(newValue || '')}
            styles={styleNames.sqlEditorTextField}
          />
        ) : (
          <Text styles={{ root: styleNames.sqlEditorReadOnly }}>
            {currentSqlMessage.sql}
          </Text>
        )}

        <div className={classNames.sqlEditorActions}>
          {!isEditingSql ? (
            <>
              <Icon
                iconName="Edit"
                className={classNames.iconButton}
                onClick={handleEditSql}
              />
              <Icon
                iconName="Cancel"
                className={classNames.iconButton}
                onClick={() => setShowSqlEditor(false)}
              />
            </>
          ) : (
            <>
              <Icon
                iconName="CheckMark"
                className={classNames.iconButton}
                onClick={handleSaveSql}
              />
              <Icon
                iconName="Cancel"
                className={classNames.iconButton}
                onClick={handleCancelEdit}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  const renderCombinedQueryEditor = () => {
    if (!message.combinedQuery) return null;

    const containerClassName = showCombinedQuery
      ? classNames.sqlEditorContainer
      : mergeStyles(classNames.sqlEditorContainer, classNames.sqlEditorContainerHidden);

    return (
      <div className={containerClassName}>
        <Text styles={{ root: styleNames.sqlEditorReadOnly }}>
          {message.combinedQuery}
        </Text>
        <div className={classNames.sqlEditorActions}>
          <Icon
            iconName="Cancel"
            className={classNames.iconButton}
            onClick={() => setShowCombinedQuery(false)}
          />
        </div>
      </div>
    );
  };

  const renderTableActionButtons = () => {
    if (!currentSqlMessage) return null;

    return (
      <div>
        <div className={classNames.buttonRow}>
          <Icon
            iconName="Copy"
            className={classNames.iconButton}
            onClick={handleCopy}
          />
          {currentSqlMessage.sql && (
            <Icon
              iconName="Database"
              className={`${classNames.iconButton} ${showSqlEditor ? classNames.iconButtonActive : ''}`}
              onClick={handleShowSql}
            />
          )}
          {message.combinedQuery && (
            <Icon
              iconName="FileCode"
              className={`${classNames.iconButton} ${showCombinedQuery ? classNames.iconButtonActive : ''}`}
              onClick={handleShowCombinedQuery}
            />
          )}
          <Icon
            iconName={currentSqlMessage.reaction === 'Like' ? 'LikeSolid' : 'Like'}
            className={classNames.iconButton}
            styles={currentSqlMessage.reaction === 'Like' ? styleNames.iconButtonFeedbackActive : undefined}
            onClick={handleLike}
          />
          <Icon
            iconName={currentSqlMessage.reaction === 'Dislike' ? 'DislikeSolid' : 'Dislike'}
            className={classNames.iconButton}
            styles={currentSqlMessage.reaction === 'Dislike' ? styleNames.iconButtonFeedbackActive : undefined}
            onClick={handleDislike}
          />
          <Icon
            iconName='FullScreen'
            className={classNames.iconButton}
            onClick={handleExpandTable}
          />
        </div>
        {currentSqlMessage?.sql && showSqlEditor && renderSqlEditor()}
        {message.combinedQuery && showCombinedQuery && renderCombinedQueryEditor()}
      </div>
    );
  };

  return (
    <Stack className={classNames.root}>
      {renderMessage()}

      {showExpandedTable && (
        <ExpandedTableView
          isOpen={showExpandedTable}
          data={expandedTableData}
          onClose={handleCloseExpandedTable}
          onCellClick={handleCellClick}
          isCellClickable={isCellClickable}
          theme={customTheme || currentTheme}
        />
      )}

      <ContextMenu
        isVisible={contextMenu.isVisible}
        target={contextMenu.target}
        cellValue={contextMenu.cellValue}
        fieldName={contextMenu.fieldName}
        columnName={contextMenu.columnName}
        tableName={contextMenu.tableName}
        rowData={contextMenu.rowData}
        onDismiss={handleCloseContextMenu}
        theme={customTheme || currentTheme}
      />
    </Stack>
  );
};

export const Message = styled<IMessageProps, IMessageStyleProps, IMessageStyles>(
  MessageBase,
  getStyles,
  undefined,
  { scope: 'Message' }
);