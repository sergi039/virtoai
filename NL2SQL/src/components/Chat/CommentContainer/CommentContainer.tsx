import * as React from 'react';
import { Stack, TextField, styled } from '@fluentui/react';
import type { ICommentContainerProps, ICommentContainerStyleProps, ICommentContainerStyles } from './CommentContainer.types';
import { getStyles } from './CommentContainer.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';

const CommentContainerBase: React.FunctionComponent<ICommentContainerProps> = ({
  isVisible,
  onCommentChange,
  theme: customTheme,
}) => {
  const currentTheme = useNL2SQLStore((state) => state.currentTheme);
  const styleProps: ICommentContainerStyleProps = { theme: customTheme || currentTheme, isVisible };
  const styleNames = getStyles(styleProps);

  return (
    <Stack styles={styleNames.root}>
      <TextField
        placeholder="What could be improved?"
        styles={styleNames.input}
        onChange={(_, newValue) => onCommentChange(newValue || '')}
      />
    </Stack>
  );
};

export const CommentContainer = styled<ICommentContainerProps, ICommentContainerStyleProps, ICommentContainerStyles>(
  CommentContainerBase,
  getStyles,
  undefined,
  { scope: 'CommentContainer' }
);