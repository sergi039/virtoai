import { classNamesFunction } from '@fluentui/react';
import type { IFeedbackButtonsStyleProps, IFeedbackButtonsStyles } from './FeedbackButtons.types';

export const getStyles = (props: IFeedbackButtonsStyleProps): IFeedbackButtonsStyles => {
  const { theme } = props;


  return {
    root: {
      root: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'row', 
        maxWidth: '800px',
        width: '100%',
      },
    },
    button: {
      root: {
        background: 'none',
        border: `1px solid ${theme?.palette.neutralLighter}`,
        borderRadius: '4px',
        padding: '4px 8px',
        color: theme?.palette.black,
        fontSize: '12px',
        transition: 'all 0.2s',
        margin: '10px 5px 0px 10px',
      },
      rootHovered: {
        color: theme?.palette.black,
        backgroundColor: theme?.palette.neutralLighter,
      },
    },
  };
};

export const getClassNames = classNamesFunction<IFeedbackButtonsStyleProps, IFeedbackButtonsStyles>();