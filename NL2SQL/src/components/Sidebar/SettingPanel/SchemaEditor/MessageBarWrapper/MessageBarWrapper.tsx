import React from 'react';
import {
  MessageBar,
  styled,
} from '@fluentui/react';
import {
  IMessageBarWrapperProps,
  IMessageBarWrapperStyleProps,
  IMessageBarWrapperStyles,
} from './MessageBarWrapper.types';
import { getClassNames, getStyles } from './MessageBarWrapper.styles';

const MessageBarWrapperBase: React.FC<IMessageBarWrapperProps> = ({
  theme,
  message,
  onDismiss
}) => {
  const styleProps: IMessageBarWrapperStyleProps = { theme };
  const classNames = getClassNames(getStyles, styleProps);

  if (!message) {
    return null;
  }

  return (
    <div className={classNames.root}>
      <MessageBar
        messageBarType={message.type}
        isMultiline={false}
        onDismiss={onDismiss}
        dismissButtonAriaLabel="Close"
        className={classNames.messageBar}
      >
        {message.text}
      </MessageBar>
    </div>
  );
};

export const MessageBarWrapper = styled<IMessageBarWrapperProps, IMessageBarWrapperStyleProps, IMessageBarWrapperStyles>(
  MessageBarWrapperBase,
  getStyles,
  undefined,
  { scope: 'MessageBarWrapper' }
);
