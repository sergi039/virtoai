import { classNamesFunction } from '@fluentui/react';
import type { IMessagesContainerStyleProps, IMessagesContainerStyles } from './MessagesContainer.types';

export const getStyles = (props: IMessagesContainerStyleProps): IMessagesContainerStyles => {
  const { theme } = props;

  return {
    root: {
      flex: 1,
      paddingBottom: '30px',
      scrollBehavior: 'smooth',
      backgroundColor: theme?.palette.white
    },
  };
};

export const getClassNames = classNamesFunction<IMessagesContainerStyleProps, IMessagesContainerStyles>();