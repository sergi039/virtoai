import * as React from 'react';
import { IconButton, Stack, styled } from '@fluentui/react';
import type { IFeedbackButtonsProps, IFeedbackButtonsStyleProps, IFeedbackButtonsStyles } from './FeedbackButtons.types';
import { getStyles } from './FeedbackButtons.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';

const FeedbackButtonsBase: React.FunctionComponent<IFeedbackButtonsProps> = ({
  onPositiveClick,
  onNegativeClick,
  theme: customTheme,
}) => {
  const currentTheme = useNL2SQLStore((state) => state.currentTheme);
  const styleProps: IFeedbackButtonsStyleProps = { theme: customTheme || currentTheme };
  const styleNames = getStyles(styleProps);

  return (
    <Stack styles={styleNames.root}>
      <IconButton
        iconProps={{ iconName: 'Like' }}
        styles={styleNames.button}
        onClick={onPositiveClick}
      />
      <IconButton
        iconProps={{ iconName: 'Dislike' }}
        styles={styleNames.button}
        onClick={onNegativeClick}
      />
    </Stack>
  );
};

export const FeedbackButtons = styled<IFeedbackButtonsProps, IFeedbackButtonsStyleProps, IFeedbackButtonsStyles>(
  FeedbackButtonsBase,
  getStyles,
  undefined,
  { scope: 'FeedbackButtons' }
);