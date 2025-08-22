import { classNamesFunction } from '@fluentui/react';
import type { IChatContainerStyleProps, IChatContainerStyles } from './ChatContainer.types';

export const getStyles = (): IChatContainerStyles => {
  return {
    root: {
      maxWidth: '1450px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: '95vh',
      padding: 0,
      position: 'relative',
      paddingTop: '60px',
    },
    messagesArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    inputArea: {
      position: 'sticky',
      bottom: 0,
      borderRadius: '24px',
      width: '100%',
      backgroundColor: 'white',
      zIndex: 100,
    }
  };
};

export const getClassNames = classNamesFunction<IChatContainerStyleProps, IChatContainerStyles>();