import { classNamesFunction } from '@fluentui/react';
import { IMessageBarWrapperStyleProps, IMessageBarWrapperStyles } from './MessageBarWrapper.types';

export const getStyles = (): IMessageBarWrapperStyles => {
  return {
    root: {
      marginBottom: '16px',
    },
    messageBar: {
      marginBottom: '16px',
    },
  };
};

export const getClassNames = classNamesFunction<IMessageBarWrapperStyleProps, IMessageBarWrapperStyles>();
