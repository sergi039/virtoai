import { Stack, styled, Text } from '@fluentui/react';
import type { IMainLayoutProps, IMainLayoutStyleProps, IMainLayoutStyles } from './MainLayout.types';
import { getStyles, getClassNames } from './MainLayout.styles';
import { useNL2SQLStore } from '../../stores/useNL2SQLStore';
import { Sidebar } from '../Sidebar';
import { ChatContainer } from '../Chat';
import { MessagesContainer } from '../Chat/MessagesContainer';
import { ExamplesContainer } from '../Chat/ExamplesContainer';
import { InputContainer } from '../Chat/InputContainer';
import { useState, useEffect, useRef } from 'react';
import strings from '../../Ioc/en-us';
import { IChat, IMessage, ISqlMessage, INlpQueryRequest, ReactionType, IAIModel } from '../../api/model';
import { IChatContainerStyleProps } from '../Chat/ChatContainer.types';
import { getStyles as getChatContainerStyles, getClassNames as getChatContainerClassNames } from '../Chat/ChatContainer.styles';
import { exampleQueries } from '../../api/constants/exampleQueries';
import { DATA_SOURCES } from '../../api/constants/defaultServices';
import { InfoPanel } from '../Chat/InfoPanel';

const MainLayoutBase: React.FunctionComponent<IMainLayoutProps> = ({ theme: customTheme }) => {
  const {
    currentTheme,
    currentChat,
    addChat,
    addMessage,
    generateAIMessage,
    isCheckBrokeChain,
    generateClarifying,
    selectedAIModels,
    currentMessages,
    currentUser,
    editSqlMessage,
    isChatLoading,
    setChatLoading
  } = useNL2SQLStore();
  const [localMessages, setLocalMessages] = useState<IMessage[]>(currentMessages || []);
  const [visitedChatIds, setVisitedChatIds] = useState<number[]>([]);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTo({
          top: mainContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const createLoadingMessage = (chatId: number): IMessage => {
    return {
      id: -1, 
      text: null,
      previousMessageId: null,
      combinedQuery: '',
      type: 'answer',
      suggestions: '',
      followUpQuestions: '',
      isUser: false,
      createdAt: new Date(),
      chatId: chatId,
      isLoading: true,
      sqlMessages: []
    };
  };

  const getMessagesToDisplay = (): IMessage[] => {
    if (!currentChat) return localMessages;
    
    const isLoading = isChatLoading(currentChat.id);
    if (isLoading) {
      const loadingMessage = createLoadingMessage(currentChat.id);
      return [...localMessages, loadingMessage];
    }
    
    return localMessages;
  };

  const createLoadingSqlMessages = (baseId: number): ISqlMessage[] => {
    const modelsToUse = selectedAIModels.length > 0 ? selectedAIModels : [];
    return modelsToUse.map((model, index) => ({
      id: baseId + 100 + index,
      sql: null,
      text: strings.Chat.loading,
      isSyntaxError: false,
      errorMessage: null,
      model: model.name,
      isLoading: true,
      createdAt: new Date(),
      messageId: baseId + 2,
      reaction: ReactionType.None
    }));
  };

  const createAIMessageWithTabs = (baseId: number, chatId: number, loadingSqlMessages: ISqlMessage[], previousMessageId: number, combinedQuery: string): IMessage => {
    return {
      id: baseId + 2,
      text: strings.Chat.processing,
      previousMessageId: previousMessageId,
      combinedQuery: combinedQuery,
      type: 'answer',
      suggestions: '',
      followUpQuestions: '',
      isUser: false,
      createdAt: new Date(),
      chatId: chatId,
      isLoading: false,
      sqlMessages: loadingSqlMessages
    };
  };

  const updateSqlMessageWithResult = async (
    aiMessageCreatedId: number,
    modelConfig: IAIModel,
    sqlQuery: any,
    isError: boolean = false
  ) => {
    try {
      const currentState = useNL2SQLStore.getState();
      const currentMessage = currentState.currentMessages.find(msg => msg.id === aiMessageCreatedId);
      const sqlMessageToUpdate = currentMessage?.sqlMessages.find(sqlMsg => sqlMsg.model === modelConfig.name);
      
      if (sqlMessageToUpdate) {
        const updatedSqlMessage: ISqlMessage = {
          ...sqlMessageToUpdate,
          sql: isError ? null : (sqlQuery?.sql || null),
          text: isError 
            ? `${strings.Chat.failedToGetResponse} ${modelConfig.name}`
            : (sqlQuery?.results ? JSON.stringify(sqlQuery.results) : strings.InfoPanel.noData),
          isLoading: false,
          isSyntaxError: sqlQuery?.isSyntaxError || false,
          errorMessage: sqlQuery?.errorMessage || null,
          createdAt: new Date(),
          reaction: ReactionType.None
        };

        await editSqlMessage(sqlMessageToUpdate.id, updatedSqlMessage);
        
        setLocalMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiMessageCreatedId ? {
              ...msg,
              sqlMessages: msg.sqlMessages.map(sqlMsg =>
                sqlMsg.id === sqlMessageToUpdate.id ? updatedSqlMessage : sqlMsg
              )
            } : msg
          )
        );
        scrollToBottom();
      }
    } catch (updateError) {
      const currentState = useNL2SQLStore.getState();
      const currentMessage = currentState.currentMessages.find(msg => msg.id === aiMessageCreatedId);
      const sqlMessageToUpdate = currentMessage?.sqlMessages.find(sqlMsg => sqlMsg.model === modelConfig.name);
      
      if (sqlMessageToUpdate) {
        const errorSqlMessage: ISqlMessage = {
          ...sqlMessageToUpdate,
          sql: null,
          text: `${strings.Chat.failedToUpdateMessage} ${modelConfig.name}`,
          isLoading: false,
          createdAt: new Date(),
          reaction: ReactionType.None
        };

        try {
          await editSqlMessage(sqlMessageToUpdate.id, errorSqlMessage);
        } catch (finalError) {
        }
      }
    }
  };

  const processAIModelRequest = async (
    modelConfig: IAIModel,
    aiRequestOptions: INlpQueryRequest,
    aiMessageCreatedId: number
  ) => {
    try {
      const aiResponse = await generateAIMessage(aiRequestOptions);

      if (aiResponse && aiResponse.sqlQueries && aiResponse.sqlQueries.length > 0) {
        const sqlQuery = aiResponse.sqlQueries[0];
        await updateSqlMessageWithResult(aiMessageCreatedId, modelConfig, sqlQuery, false);
      } else {
        await updateSqlMessageWithResult(aiMessageCreatedId, modelConfig, null, true);
      }
    } catch (error) {
      await updateSqlMessageWithResult(aiMessageCreatedId, modelConfig, null, true);
    }
  };

  const handleAllModelsRequest = async (query: string, chatId: number, userMessageId: number) => {
    try {
      const modelToUse = selectedAIModels.length > 0 ? selectedAIModels[0] : null;
      if (!modelToUse) {
        throw new Error(strings.Chat.noModelSelected);
      }

      const aiRequestOptions: INlpQueryRequest = {
        query,
        chatId: chatId,
        model: modelToUse.value,
        dataSources: currentChat ? DATA_SOURCES : ["employees", "sales", "products", "customers", "revenue"],
      };

      const clarificationResponse = await generateClarifying(aiRequestOptions);
      
      if (clarificationResponse && 
          clarificationResponse.questions.length === 1 && 
          clarificationResponse.questions[0] === strings.Chat.unclearRequest) {
            console.log('test');
        
        const errorMessage: IMessage = {
          id: Date.now() + 2,
          text: strings.Chat.unclearRequest,
          previousMessageId: userMessageId,
          combinedQuery: query,
          type: 'answer',
          suggestions: '',
          followUpQuestions: '',
          isUser: false,
          createdAt: new Date(),
          chatId: chatId,
          isLoading: false,
          sqlMessages: []
        };

        setLocalMessages(prevMessages => [...prevMessages, errorMessage]);
        scrollToBottom();

        const createdMessage = await addMessage(errorMessage);
        if (createdMessage) {
          setLocalMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === errorMessage.id ? createdMessage : msg
            )
          );
        }
        return;
      }
      
      const baseId = Date.now();
      const loadingSqlMessages = createLoadingSqlMessages(baseId);

      let messageType: 'answer' | 'question' = 'answer';
      let suggestions = '';
      let followUpQuestions = '';
      let combinedQueryForMessage = query;
      
      if (clarificationResponse && (clarificationResponse.questions.length > 0 || clarificationResponse.suggests.length > 0)) {
        messageType = 'question';
        suggestions = JSON.stringify(clarificationResponse.suggests);
        followUpQuestions = JSON.stringify(clarificationResponse.questions);
      }
      
      const aiMessageWithTabs = createAIMessageWithTabs(baseId, chatId, loadingSqlMessages, userMessageId, combinedQueryForMessage);
      
      const updatedMessage: IMessage = {
        ...aiMessageWithTabs,
        type: messageType,
        suggestions: suggestions,
        followUpQuestions: followUpQuestions,
        combinedQuery: combinedQueryForMessage
      };

      setLocalMessages(prevMessages => [...prevMessages, updatedMessage]);
      scrollToBottom();

      const aiMessageCreated = await addMessage(updatedMessage);

      if (aiMessageCreated) {
        setLocalMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === updatedMessage.id ? aiMessageCreated : msg
          )
        );
        scrollToBottom();

        const modelsToUse = selectedAIModels.length > 0 ? selectedAIModels : [];
        const aiRequestPromises = modelsToUse.map(async (modelConfig) => {
          const aiRequestOptions: INlpQueryRequest = {
            query: combinedQueryForMessage,
            chatId: chatId,
            model: modelConfig.value,
            dataSources: currentChat ? DATA_SOURCES : ["employees", "sales", "products", "customers", "revenue"],
          };

          await processAIModelRequest(modelConfig, aiRequestOptions, aiMessageCreated.id);
        });

        Promise.allSettled(aiRequestPromises).then(results => {
          const failedRequests = results.filter(result => result.status === 'rejected');
          if (failedRequests.length > 0) {
            console.log('Some AI model requests failed:', failedRequests);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error in handleAllModelsRequest:', error);
    }
  };

  const handleSingleModelRequest = async (query: string, chatId: number, userMessageId: number) => {
    try {
      const modelToUse = selectedAIModels.length > 0 ? selectedAIModels[0] : null;
      
      if (!modelToUse) {
        throw new Error(strings.Chat.noModelSelected);
      }

      let aiRequestOptions: INlpQueryRequest = {
        query,
        chatId: chatId,
        model: modelToUse.value,
        dataSources: currentChat ? DATA_SOURCES : ["employees", "sales", "products", "customers", "revenue"],
      };

      const clarificationResponse = await generateClarifying(aiRequestOptions);

      aiRequestOptions.query = clarificationResponse?.mainGeneratedQuery || query;
      
      if (clarificationResponse && 
          clarificationResponse.questions.length === 1 && 
          clarificationResponse.questions[0] === strings.Chat.unclearRequest) {
        
        const errorMessage: IMessage = {
          id: Date.now() + 2,
          text: strings.Chat.unclearRequest,
          previousMessageId: userMessageId,
          combinedQuery: clarificationResponse?.mainGeneratedQuery || query,
          type: 'answer',
          suggestions: '',
          followUpQuestions: '',
          isUser: false,
          createdAt: new Date(),
          chatId: chatId,
          isLoading: false,
          sqlMessages: []
        };

        setLocalMessages(prevMessages => [...prevMessages, errorMessage]);
        scrollToBottom();

        const createdMessage = await addMessage(errorMessage);
        if (createdMessage) {
          setLocalMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === errorMessage.id ? createdMessage : msg
            )
          );
        }
        return;
      }
      
      const aiResponse = await generateAIMessage(aiRequestOptions);

      let messageType: 'answer' | 'question' = 'answer';
      let suggestions = '';
      let followUpQuestions = '';
      let combinedQueryForMessage = clarificationResponse?.mainGeneratedQuery || query;
      
      if (clarificationResponse && (clarificationResponse.questions.length > 0 || clarificationResponse.suggests.length > 0)) {
        messageType = 'question';
        suggestions = JSON.stringify(clarificationResponse.suggests);
        followUpQuestions = JSON.stringify(clarificationResponse.questions);
      }

      const sqlMessages: ISqlMessage[] = [];
      if (aiResponse && aiResponse.sqlQueries && aiResponse.sqlQueries.length > 0) {
        aiResponse.sqlQueries.forEach((sqlQuery, index) => {
          if (sqlQuery.sql) {
            sqlMessages.push({
              id: Date.now() + index + 10,
              sql: sqlQuery.sql,
              text: sqlQuery.results ? JSON.stringify(sqlQuery.results) : strings.InfoPanel.noData,
              model: sqlQuery.modelName,
              errorMessage: sqlQuery.errorMessage || null,
              isSyntaxError: sqlQuery.isSyntaxError,
              isLoading: false,
              createdAt: new Date(),
              messageId: Date.now() + 2,
              reaction: ReactionType.None
            });
          }
        });
      }

      const aiMessage: IMessage = {
        id: Date.now() + 2,
        text: sqlMessages.length > 0 ?
          sqlMessages.map(sql => sql.text).filter(text => text).join("\n") :
          strings.Chat.noAIResponse,
        previousMessageId: userMessageId,
        combinedQuery: combinedQueryForMessage,
        type: messageType,
        suggestions: suggestions,
        followUpQuestions: followUpQuestions,
        isUser: false,
        createdAt: new Date(),
        chatId: chatId,
        isLoading: false,
        sqlMessages: sqlMessages
      };

      setLocalMessages(prevMessages => [...prevMessages, aiMessage]);
      scrollToBottom();

      const createdMessage = await addMessage(aiMessage);

      if (createdMessage) {
        setLocalMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiMessage.id ? createdMessage : msg
          )
        );
        scrollToBottom();
      }
    } catch (error) {
      const errorMessage: IMessage = {
        id: Date.now() + 3,
        text: strings.Chat.failedToGetResponse,
        previousMessageId: userMessageId,
        combinedQuery: query,
        type: 'answer',
        suggestions: '',
        followUpQuestions: '',
        isUser: false,
        createdAt: new Date(),
        chatId: chatId,
        isLoading: false,
        sqlMessages: []
      };

      setLocalMessages(prevMessages => [...prevMessages, errorMessage]);
      scrollToBottom();

      const createdMessage = await addMessage(errorMessage);

      if (createdMessage) {
        setLocalMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === errorMessage.id ? createdMessage : msg
          )
        );
        scrollToBottom();
      }
    }
  };

  useEffect(() => {
    if (currentMessages) {
      setLocalMessages(currentMessages);
      scrollToBottom();
    } else {
      setLocalMessages([]);
    }
  }, [currentMessages]);

  useEffect(() => {
    if (currentChat && !visitedChatIds.includes(currentChat.id)) {
      setVisitedChatIds(prev => [...prev, currentChat.id]);
      scrollToBottom();
    }
  }, [currentChat?.id, visitedChatIds]);

  const styleProps: IMainLayoutStyleProps = { theme: customTheme || currentTheme };
  const styleChatContainerProps: IChatContainerStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);
  const chatContainerStyles = getChatContainerClassNames(getChatContainerStyles, styleChatContainerProps);

  const handleSubmit = async (query: string) => {
    try {
      if (!currentChat) {
        const newChat: IChat = {
          id: Date.now(),
          title: query.length > 20 ? `${query.substring(0, 20)}...` : query,
          userOwnerId: currentUser.id,
          messages: [],
          chatUsers: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const createdChat = await addChat(newChat);
        if (!createdChat) return;

        const userMessage: IMessage = {
          id: Date.now(),
          text: query,
          previousMessageId: null,
          combinedQuery: query,
          type: 'question',
          suggestions: '',
          followUpQuestions: '',
          isUser: true,
          createdAt: new Date(),
          chatId: createdChat.id,
          isLoading: false,
          sqlMessages: []
        };

        setLocalMessages(prevMessages => [...prevMessages, userMessage]);
        scrollToBottom();

        const userMessageCreated = await addMessage(userMessage);
        if (!userMessageCreated) {
          setLocalMessages(prevMessages => 
            prevMessages.filter(msg => msg.id !== userMessage.id)
          );
          scrollToBottom();
          return;
        }

        setLocalMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === userMessage.id ? userMessageCreated : msg
          )
        );
        scrollToBottom();

        await processMessage(query, createdChat.id, userMessageCreated.id);
      } else {
        const checkRequest: INlpQueryRequest = {
          query: query,
          chatId: currentChat.id,
          model: '',
          dataSources: currentChat ? DATA_SOURCES : ["employees", "sales", "products", "customers", "revenue"],
        };

        const isChainBroken = await isCheckBrokeChain(checkRequest);
        
        let combinedQuery: string;
        let previousMessageId: number | null = null;

        if (isChainBroken) {
          combinedQuery = query;
          previousMessageId = null;
        } else {
          combinedQuery = buildCombinedQueryFromChain(query);
          const lastMessage = currentMessages[currentMessages.length - 1];
          previousMessageId = lastMessage ? lastMessage.id : null;
        }

        const userMessage: IMessage = {
          id: Date.now(),
          text: query,
          previousMessageId: previousMessageId,
          combinedQuery: combinedQuery,
          type: 'question',
          suggestions: '',
          followUpQuestions: '',
          isUser: true,
          createdAt: new Date(),
          chatId: currentChat.id,
          isLoading: false,
          sqlMessages: []
        };

        setLocalMessages(prevMessages => [...prevMessages, userMessage]);
        scrollToBottom();

        const userMessageCreated = await addMessage(userMessage);
        if (!userMessageCreated) {
          setLocalMessages(prevMessages => 
            prevMessages.filter(msg => msg.id !== userMessage.id)
          );
          scrollToBottom();
          return;
        }

        setLocalMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === userMessage.id ? userMessageCreated : msg
          )
        );
        scrollToBottom();

        await processMessage(combinedQuery, currentChat.id, userMessageCreated.id);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const findChainStart = (startMessage: IMessage): IMessage => {
    let currentMessage = startMessage;
    
    while (currentMessage.previousMessageId !== null) {
      const previousMessage = currentMessages.find(msg => msg.id === currentMessage.previousMessageId);
      if (!previousMessage) {
        break;
      }
      currentMessage = previousMessage;
    }
    
    return currentMessage;
  };

  const getMessageChain = (endMessage: IMessage): IMessage[] => {
    const chain: IMessage[] = [];
    const startMessage = findChainStart(endMessage);

    const buildChain = (currentMessage: IMessage) => {
      chain.push(currentMessage);

      const nextMessage = currentMessages.find(msg => msg.previousMessageId === currentMessage.id);
      if (nextMessage) {
        buildChain(nextMessage);
      }
    };
    
    buildChain(startMessage);
    return chain;
  };

  const buildCombinedQueryFromChain = (newQuery: string): string => {
    const lastMessage = currentMessages[currentMessages.length - 1];

    if (!lastMessage) {
      return newQuery;
    }

    if (!lastMessage.combinedQuery || lastMessage.combinedQuery.trim() === '') {
      return newQuery;
    }

    const messageChain = getMessageChain(lastMessage);
    
    const userMessages = messageChain.filter(msg => msg.isUser);

    const userQuestions = userMessages
      .filter(msg => msg.type === 'question')
      .map(msg => msg.text);
    
    const userAnswers = userMessages
      .filter(msg => msg.type === 'answer')
      .map(msg => msg.text);

    const allQueries = [...userQuestions, ...userAnswers, newQuery];
    const result = allQueries.join(' ').trim();
    return result;
  };

  const processMessage = async (combinedQuery: string, chatId: number, previousMessageId: number) => {
    setChatLoading(chatId, true);
    
    try {
      if (selectedAIModels.length > 1) {
        await handleAllModelsRequest(combinedQuery, chatId, previousMessageId);
      } else {
        await handleSingleModelRequest(combinedQuery, chatId, previousMessageId);
      }
    } catch (error) {
      console.error('❌ Error in processMessage:', error);
    } finally {
      setChatLoading(chatId, false);
    }
  };

  return (
    <Stack className={classNames.root}>
      <Sidebar />
      <div className={classNames.mainContainer} ref={mainContainerRef}>
        <InfoPanel />
        <ChatContainer>
          {localMessages.length === 0 ? (
            <Stack className={classNames.emptyContainer}>
              <Text className={classNames.title}>{strings.Chat.exampleTitle}</Text>
              <div className={classNames.fullWidthInputContainer}>
                <InputContainer onSubmit={handleSubmit} />
              </div>
              <ExamplesContainer examples={exampleQueries} onExampleClick={handleSubmit} />
            </Stack>
          ) : (
            <>
              <div className={chatContainerStyles.messagesArea}>
                <MessagesContainer messages={getMessagesToDisplay()} />
              </div>
              <div className={chatContainerStyles.inputArea}>
                <InputContainer onSubmit={handleSubmit} />
              </div>
            </>
          )}
        </ChatContainer>
      </div>
    </Stack>
  );
};

export const MainLayout = styled<IMainLayoutProps, IMainLayoutStyleProps, IMainLayoutStyles>(
  MainLayoutBase,
  getStyles,
  undefined,
  { scope: 'MainLayout' }
);